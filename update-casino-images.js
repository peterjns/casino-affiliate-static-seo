const fs = require('fs');
const path = require('path');

// Casino image mappings based on provided logos
const casinoImages = {
    'DreamBet.io': 'images/dreambet-logo.png',
    'Stake.com': 'images/stake-logo.png', 
    'BetMGM Casino': 'images/betmgm-logo.png',
    'Betway Casino': 'images/betway-logo.png',
    'LeoVegas': 'images/leovegas-logo.png',
    '888 Casino': 'images/888casino-logo.png',
    'Casumo': 'images/casumo-logo.png',
    'Rizk': 'images/rizk-logo.png',
    'Wildz': 'images/wildz-logo.png',
    'Thunderkick': 'images/thunderkick-logo.png'
};

// Function to update casino images in HTML files
function updateCasinoImages(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace placeholder images with actual casino logos
        Object.entries(casinoImages).forEach(([casinoName, imagePath]) => {
            // Replace various image patterns
            const patterns = [
                new RegExp(`src="[^"]*casino-${casinoName.toLowerCase().replace(/[^a-z]/g, '')}-logo[^"]*"`, 'gi'),
                new RegExp(`src="[^"]*${casinoName.toLowerCase().replace(/[^a-z]/g, '')}[^"]*\\.(png|jpg|jpeg|svg)"`, 'gi'),
                new RegExp(`src="https://via\\.placeholder\\.com/[^"]*"`, 'g')
            ];
            
            patterns.forEach(pattern => {
                content = content.replace(pattern, `src="${imagePath}"`);
            });
        });
        
        // Fix broken image references
        content = content.replace(/src="[^"]*placeholder[^"]*"/gi, 'src="images/casino-placeholder.png"');
        content = content.replace(/src="[^"]*casino-logo[^"]*"/gi, 'src="images/casino-placeholder.png"');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated casino images in: ${filePath}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

// Get all HTML files that might contain casino images
const htmlFiles = [
    'index.html',
    'casinos.html', 
    'bonuses.html',
    'reviews.html',
    // Casino review pages
    'casino-dreambet.html',
    'casino-stake.html',
    'casino-betmgm.html',
    'casino-betway.html',
    'casino-leovegas.html',
    'casino-888casino.html',
    'casino-casumo.html',
    'casino-rizk.html',
    'casino-wildz.html',
    'casino-thunderkick.html'
];

// Update all HTML files
console.log('🔄 Updating casino images across all pages...\n');

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        updateCasinoImages(filePath);
    } else {
        console.log(`⚠️  File not found: ${file}`);
    }
});

console.log('\n✅ Casino image update completed!');
console.log('All casino logos have been updated with the new provided images.');
