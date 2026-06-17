const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixEditorContent() {
  try {
    console.log('🔧 Fixing Editor.js content in articles...');
    
    // Get all articles
    const articles = await prisma.article.findMany();
    
    console.log(`📊 Found ${articles.length} articles to check`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const article of articles) {
      try {
        // Skip if content is empty
        if (!article.content || article.content.trim() === '') {
          console.log(`⏭️  Skipping article ${article.id}: empty content`);
          continue;
        }
        
        // Try to parse as JSON
        let contentData;
        try {
          contentData = JSON.parse(article.content);
        } catch (parseError) {
          // If it's not JSON, it might be plain text - convert it
          console.log(`🔄 Converting plain text to Editor.js format for article ${article.id}`);
          
          contentData = {
            time: Date.now(),
            blocks: [
              {
                id: Math.random().toString(36).substr(2, 9),
                type: 'paragraph',
                data: {
                  text: article.content
                }
              }
            ],
            version: '2.28.0'
          };
          
          // Update the article
          await prisma.article.update({
            where: { id: article.id },
            data: { content: JSON.stringify(contentData) }
          });
          
          fixedCount++;
          console.log(`✅ Fixed article ${article.id}: "${article.title}"`);
          continue;
        }
        
        // Check if it's valid Editor.js format
        if (!contentData.blocks || !Array.isArray(contentData.blocks)) {
          console.log(`⚠️  Invalid Editor.js format for article ${article.id}, converting...`);
          
          // Convert to proper format
          const newContent = {
            time: Date.now(),
            blocks: [
              {
                id: Math.random().toString(36).substr(2, 9),
                type: 'paragraph',
                data: {
                  text: typeof contentData === 'string' ? contentData : JSON.stringify(contentData)
                }
              }
            ],
            version: '2.28.0'
          };
          
          await prisma.article.update({
            where: { id: article.id },
            data: { content: JSON.stringify(newContent) }
          });
          
          fixedCount++;
          console.log(`✅ Fixed article ${article.id}: "${article.title}"`);
        } else {
          // Validate each block
          let needsUpdate = false;
          const validBlocks = contentData.blocks.filter(block => {
            if (!block.type || !block.data) {
              console.log(`⚠️  Invalid block found in article ${article.id}, removing...`);
              needsUpdate = true;
              return false;
            }
            return true;
          });
          
          if (needsUpdate) {
            contentData.blocks = validBlocks;
            await prisma.article.update({
              where: { id: article.id },
              data: { content: JSON.stringify(contentData) }
            });
            fixedCount++;
            console.log(`✅ Cleaned invalid blocks in article ${article.id}`);
          } else {
            console.log(`✓ Article ${article.id} is already valid`);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error processing article ${article.id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Fixed: ${fixedCount} articles`);
    console.log(`❌ Errors: ${errorCount} articles`);
    console.log(`✓ Total checked: ${articles.length} articles`);
    console.log('\n🎉 Done!');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixEditorContent()
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
