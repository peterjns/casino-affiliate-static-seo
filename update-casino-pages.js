const fs = require('fs');
const path = require('path');

// Casino data with essential details
const casinos = [
    { id: 'dreambet', name: 'DreamBet.io', bonus: '$1,000,000', rating: 4.7, icon: 'gem', color: 'blue-600' },
    { id: 'stake', name: 'Stake.com', bonus: '200% up to $1,000', rating: 4.8, icon: 'bitcoin', color: 'green-600' },
    { id: 'betmgm', name: 'BetMGM Casino', bonus: '$1,000', rating: 4.6, icon: 'crown', color: 'yellow-600' },
    { id: 'betway', name: 'Betway Casino', bonus: '$1,000', rating: 4.5, icon: 'futbol', color: 'red-600' },
    { id: 'leovegas', name: 'LeoVegas', bonus: 'Up to $1,500', rating: 4.8, icon: 'mobile-alt', color: 'orange-600' },
    { id: '888casino', name: '888 Casino', bonus: '$1,500', rating: 4.6, icon: 'gem', color: 'pink-600' },
    { id: 'casumo', name: 'Casumo', bonus: 'Up to $300', rating: 4.7, icon: 'gamepad', color: 'purple-600' },
    { id: 'rizk', name: 'Rizk', bonus: 'Up to $100', rating: 4.5, icon: 'shield-alt', color: 'red-500' },
    { id: 'wildz', name: 'Wildz', bonus: 'Up to $500', rating: 4.7, icon: 'bolt', color: 'yellow-400' },
    { id: 'thunderkick', name: 'Thunderkick', bonus: '100 Free Spins', rating: 4.4, icon: 'bolt', color: 'blue-400' }
];

// Function to generate casino HTML
function generateCasinoHTML(casino) {
    return `
    <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-${casino.color} rounded-lg mr-4 flex items-center justify-center">
                    <i class="${casino.icon.startsWith('fa-') ? 'fas ' + casino.icon : 'fab fa-' + casino.icon} text-white"></i>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">${casino.name}</h2>
                    <div class="flex items-center">
                        ${Array(5).fill().map((_, i) => 
                            `<i class="fas fa-star ${i < Math.floor(casino.rating) ? 'text-yellow-400' : 'text-gray-300'}"></i>`
                        ).join('')}
                        <span class="ml-2 text-gray-600">${casino.rating}/5</span>
                    </div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-green-600">${casino.bonus}</div>
                <div class="text-sm text-gray-600">Welcome Bonus</div>
            </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 mt-4">
            <a href="casino-${casino.id}.html" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-center transition-colors">
                Read Full Review
            </a>
            <a href="#" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg text-center transition-colors">
                Claim Bonus
            </a>
        </div>
    </div>`;
}

// Function to generate bonus HTML (matching casino section style)
function generateBonusHTML(casino) {
    return `
    <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-${casino.color} rounded-lg mr-4 flex items-center justify-center">
                    <i class="${casino.icon.startsWith('fa-') ? 'fas ' + casino.icon : 'fab fa-' + casino.icon} text-white"></i>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">${casino.name}</h2>
                    <div class="flex items-center">
                        ${Array(5).fill().map((_, i) => 
                            `<i class="fas fa-star ${i < Math.floor(casino.rating) ? 'text-yellow-400' : 'text-gray-300'}"></i>`
                        ).join('')}
                        <span class="ml-2 text-gray-600">${casino.rating.toFixed(1)}/5</span>
                    </div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-green-600">${casino.bonus}</div>
                <div class="text-sm text-gray-600">Welcome Bonus</div>
            </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 mt-4">
            <a href="casino-${casino.id}.html" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-center transition-colors">
                Read Full Review
            </a>
            <a href="#" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg text-center transition-colors">
                Claim Bonus
            </a>
        </div>
    </div>`;
}

// Function to update a file
function updateFile(filePath, startMarker, endMarker, newContent) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const startIndex = content.indexOf(startMarker);
        const endIndex = content.indexOf(endMarker, startIndex + startMarker.length);
        
        if (startIndex !== -1 && endIndex !== -1) {
            const before = content.substring(0, startIndex + startMarker.length);
            const after = content.substring(endIndex);
            
            // Write the new content between the markers
            fs.writeFileSync(filePath, before + '\n' + newContent + '\n' + after, 'utf8');
            console.log(`✅ Updated ${filePath}`);
            
            // Clean up any duplicate markers that might have been created
            let cleanContent = fs.readFileSync(filePath, 'utf8');
            cleanContent = cleanContent.replace(new RegExp(`${startMarker}[\s\S]*?${endMarker}`, 'g'), 
                                         `${startMarker}\n${newContent}\n${endMarker}`);
            fs.writeFileSync(filePath, cleanContent, 'utf8');
            
        } else {
            console.error(`❌ Could not find markers in ${filePath}`);
            console.log('Start marker found:', startIndex !== -1);
            console.log('End marker found:', endIndex !== -1);
        }
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

// Update casinos.html
const casinosHTML = casinos.map(casino => generateCasinoHTML(casino)).join('\n');
updateFile(
    path.join(__dirname, 'casinos.html'),
    '<!-- START_CASINO_LIST -->',
    '<!-- END_CASINO_LIST -->',
    casinosHTML
);

// Update bonuses.html
const bonusesHTML = casinos.map(casino => generateBonusHTML(casino)).join('\n');
updateFile(
    path.join(__dirname, 'bonuses.html'),
    '<!-- START_BONUS_LIST -->',
    '<!-- END_BONUS_LIST -->',
    bonusesHTML
);

console.log('✅ All casino and bonus sections updated!');
