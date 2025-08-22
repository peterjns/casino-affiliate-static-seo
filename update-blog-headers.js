const fs = require('fs');
const path = require('path');

// Standard header template
const headerTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-TXJK92JZCG"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-TXJK92JZCG');</script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <title>%%TITLE%%</title>
    <meta name="description" content="%%DESCRIPTION%%">
    <meta name="keywords" content="%%KEYWORDS%%">
    <link rel="canonical" href="%%CANONICAL%%">
    <meta property="og:title" content="%%TITLE%%">
    <meta property="og:description" content="%%DESCRIPTION%%">
    <meta property="og:type" content="article">
    <meta property="og:url" content="%%CANONICAL%%">
    <meta property="og:site_name" content="CasinosOnlineJackpot">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@casinoexpert">
    %%STRUCTURED_DATA%%
</head>
<body class="bg-gray-50">
    <!-- Standard Header -->
    <header class="bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 shadow-lg">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex-shrink-0">
                    <a href="../index.html" class="text-white text-2xl font-bold">Casinos<span class="text-yellow-400">Online</span>Jackpot</a>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-center space-x-4">
                        <a href="../index.html" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                        <a href="../casinos.html" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Casinos</a>
                        <a href="../bonuses.html" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Bonuses</a>
                        <a href="../game-guides.html" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Game Guides</a>
                        <a href="../blog.html" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Blog</a>
                        <a href="../reviews.html" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Reviews</a>
                    </div>
                </div>
                <div class="md:hidden">
                    <button type="button" class="text-white hover:bg-blue-700 inline-flex items-center justify-center p-2 rounded-md focus:outline-none" id="mobile-menu-button">
                        <span class="sr-only">Open main menu</span>
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
            <div class="md:hidden hidden" id="mobile-menu">
                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="../index.html" class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">Home</a>
                    <a href="../casinos.html" class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">Casinos</a>
                    <a href="../bonuses.html" class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">Bonuses</a>
                    <a href="../game-guides.html" class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">Game Guides</a>
                    <a href="../blog.html" class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">Blog</a>
                    <a href="../reviews.html" class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">Reviews</a>
                </div>
            </div>
        </nav>
    </header>`;

// Function to update a single blog post
function updateBlogPost(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Extract metadata
        const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
        const descMatch = content.match(/<meta\s+name="description"[^>]*content="([^"]+)"/i);
        const keywordsMatch = content.match(/<meta\s+name="keywords"[^>]*content="([^"]+)"/i);
        const canonicalMatch = content.match(/<link\s+rel="canonical"[^>]*href="([^"]+)"/i);
        const structuredDataMatch = content.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
        
        // Extract body content
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (!bodyMatch) return;
        
        // Get article content (everything after the header)
        const articleContent = bodyMatch[1].replace(/<header[\s\S]*?<\/header>/i, '');
        
        // Build new header with extracted metadata
        let newHeader = headerTemplate
            .replace('%%TITLE%%', titleMatch ? titleMatch[1] : '')
            .replace('%%DESCRIPTION%%', descMatch ? descMatch[1] : '')
            .replace('%%KEYWORDS%%', keywordsMatch ? keywordsMatch[1] : '')
            .replace('%%CANONICAL%%', canonicalMatch ? canonicalMatch[1] : '')
            .replace('%%STRUCTURED_DATA%%', structuredDataMatch ? 
                `<script type="application/ld+json">\n${structuredDataMatch[1].trim()}\n    </script>` : '')
            // Fix any remaining template placeholders
            .replace(/%%TITLE%%/g, titleMatch ? titleMatch[1] : '')
            .replace(/%%DESCRIPTION%%/g, descMatch ? descMatch[1] : '')
            .replace(/%%CANONICAL%%/g, canonicalMatch ? canonicalMatch[1] : '');
        
        // Combine header with article content and close body/html tags
        const newContent = `${newHeader}\n${articleContent}\n</body>\n</html>`;
        
        // Write updated content back to file
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
        
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

// Process all HTML files in the blog directory
const blogDir = path.join(__dirname, 'blog');
if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            updateBlogPost(path.join(blogDir, file));
        }
    });
    console.log('✅ All blog articles have been updated with the standard header');
} else {
    console.error('❌ Blog directory not found');
}
