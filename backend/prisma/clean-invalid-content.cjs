const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanInvalidContent() {
  try {
    console.log('🧹 Cleaning invalid editor content...\n');
    
    const articles = await prisma.article.findMany();
    
    let cleanedCount = 0;
    let deletedCount = 0;
    
    for (const article of articles) {
      try {
        const content = JSON.parse(article.content);
        
        if (!content.blocks || content.blocks.length === 0) {
          console.log(`❌ Deleting article #${article.id} (empty content): "${article.title.substring(0, 50)}"`);
          await prisma.article.delete({ where: { id: article.id } });
          deletedCount++;
          continue;
        }
        
        // Check for invalid blocks with error messages
        let hasInvalidBlocks = false;
        const cleanBlocks = content.blocks.filter(block => {
          if (!block.data || !block.data.text) return false;
          
          // Check if block contains error messages
          if (block.data.text.includes('webpack://') || 
              block.data.text.includes('editorjs.mjs') ||
              block.data.text.includes('skipped because')) {
            hasInvalidBlocks = true;
            return false;
          }
          
          return true;
        });
        
        if (hasInvalidBlocks || cleanBlocks.length === 0) {
          console.log(`❌ Deleting article #${article.id} (invalid content): "${article.title.substring(0, 50)}"`);
          await prisma.article.delete({ where: { id: article.id } });
          deletedCount++;
        } else if (cleanBlocks.length < content.blocks.length) {
          // Some blocks were removed, update
          content.blocks = cleanBlocks;
          await prisma.article.update({
            where: { id: article.id },
            data: { content: JSON.stringify(content) }
          });
          cleanedCount++;
          console.log(`✅ Cleaned article #${article.id}: "${article.title.substring(0, 50)}"`);
        }
        
      } catch (e) {
        console.log(`❌ Deleting article #${article.id} (parse error): "${article.title.substring(0, 50)}"`);
        await prisma.article.delete({ where: { id: article.id } });
        deletedCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Cleaned: ${cleanedCount} articles`);
    console.log(`❌ Deleted: ${deletedCount} articles`);
    console.log(`✓ Total processed: ${articles.length} articles`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanInvalidContent();
