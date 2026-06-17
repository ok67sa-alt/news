/**
 * Parse Editor.js JSON content to HTML
 */

interface EditorJsBlock {
  id: string;
  type: string;
  data: any;
}

interface EditorJsData {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
}

export function parseEditorJsContent(content: string): string[] {
  try {
    const data: EditorJsData = JSON.parse(content);
    
    if (!data.blocks || !Array.isArray(data.blocks)) {
      return [content]; // Fallback to original content
    }

    const paragraphs: string[] = [];

    data.blocks.forEach((block) => {
      switch (block.type) {
        case 'paragraph':
          if (block.data?.text) {
            paragraphs.push(block.data.text);
          }
          break;

        case 'header':
          if (block.data?.text) {
            const level = block.data.level || 2;
            paragraphs.push(`<h${level} class="font-headline font-bold text-2xl mt-8 mb-4">${block.data.text}</h${level}>`);
          }
          break;

        case 'list':
          if (block.data?.items && Array.isArray(block.data.items)) {
            const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
            const items = block.data.items.map((item: string) => `<li>${item}</li>`).join('');
            paragraphs.push(`<${listType} class="list-disc list-inside space-y-2 my-4">${items}</${listType}>`);
          }
          break;

        case 'quote':
          if (block.data?.text) {
            paragraphs.push(`<blockquote class="border-l-4 border-brand-red pl-4 italic my-6">${block.data.text}</blockquote>`);
          }
          break;

        case 'delimiter':
          paragraphs.push(`<hr class="my-8 border-t-2 border-gray-300" />`);
          break;

        case 'image':
          if (block.data?.file?.url) {
            const caption = block.data.caption ? `<figcaption class="text-sm text-gray-600 mt-2 text-center">${block.data.caption}</figcaption>` : '';
            paragraphs.push(`<figure class="my-6"><img src="${block.data.file.url}" alt="${block.data.caption || ''}" class="w-full rounded" />${caption}</figure>`);
          }
          break;

        case 'code':
          if (block.data?.code) {
            paragraphs.push(`<pre class="bg-gray-900 text-white p-4 rounded overflow-x-auto my-4"><code>${escapeHtml(block.data.code)}</code></pre>`);
          }
          break;

        default:
          // For unknown blocks, try to extract text
          if (block.data?.text) {
            paragraphs.push(block.data.text);
          }
      }
    });

    return paragraphs.length > 0 ? paragraphs : [content];
  } catch (error) {
    console.error('Error parsing Editor.js content:', error);
    // Fallback: split by line breaks
    return content.split('\n\n').filter(p => p.trim());
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Check if content is Editor.js JSON format
 */
export function isEditorJsContent(content: string): boolean {
  try {
    const data = JSON.parse(content);
    return data && typeof data === 'object' && Array.isArray(data.blocks);
  } catch {
    return false;
  }
}
