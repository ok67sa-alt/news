import { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import LinkTool from '@editorjs/link';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Table from '@editorjs/table';

interface EditorJSComponentProps {
  onInitialize?: (instance: EditorJS) => void;
  data?: OutputData;
}

export default function EditorJSComponent({ onInitialize, data }: EditorJSComponentProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!holderRef.current || isInitialized.current) return;

    // Mark as initialized to prevent double initialization
    isInitialized.current = true;

    // Parse data if it's a string
    let parsedData: OutputData | undefined;
    if (data) {
      if (typeof data === 'string') {
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          // Silent fail - just use undefined
          parsedData = undefined;
        }
      } else {
        parsedData = data;
      }
    }

    // Validate parsed data structure
    if (parsedData && (!parsedData.blocks || !Array.isArray(parsedData.blocks))) {
      parsedData = undefined;
    }

    // Initialize Editor.js with proper error handling
    const editor = new EditorJS({
      holder: holderRef.current,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'أدخل عنوان...',
            levels: [1, 2, 3, 4],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await fetch('/api/admin/uploads', {
                  method: 'POST',
                  body: formData
                });
                
                if (response.ok) {
                  const data = await response.json();
                  return {
                    success: 1,
                    file: {
                      url: data.url
                    }
                  };
                }
                
                return {
                  success: 0
                };
              }
            }
          }
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/api/fetch-url' // Optional: you can implement this for link previews
          }
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              twitter: true,
              facebook: true,
              instagram: true
            }
          }
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'أدخل اقتباس',
            captionPlaceholder: 'المؤلف'
          }
        },
        code: {
          class: Code,
          config: {
            placeholder: 'أدخل الكود...'
          }
        },
        table: {
          class: Table as any,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        }
      },
      data: parsedData,
      placeholder: 'ابدأ بكتابة مقالك هنا...',
      minHeight: 400,
      logLevel: 'ERROR' as any, // Suppress warnings
      onReady: () => {
        if (onInitialize && editorRef.current) {
          onInitialize(editorRef.current);
        }
      }
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (e) {
          // Silent cleanup
        }
        editorRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []); // Empty dependency array to run only once

  return (
    <div>
      <div ref={holderRef} className="editorjs-container" />
    </div>
  );
}
