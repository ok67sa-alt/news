import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

export default function SeoTags({
  title,
  description,
  image = 'https://images.unsplash.com/photo-1548345680-f5475ea5df84', // Default Khartoum/Nile cover
  url = window.location.href,
  type = 'website',
  publishedTime,
  author,
}: SeoProps) {
  useEffect(() => {
    // Standardize title format
    const formattedTitle = title.includes('Sudan News Today') ? title : `${title} | Sudan News Today`;
    document.title = formattedTitle;

    // Helper to select and update or dynamically append meta tags
    const updateMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Standard SEO Tags
    updateMetaTag('name', 'description', description);

    // Open Graph / Facebook Meta Tags
    updateMetaTag('property', 'og:title', formattedTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:site_name', 'Sudan News Today');

    // Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', formattedTitle);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // Dynamic Article Properties
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('property', 'article:published_time', publishedTime);
      }
      if (author) {
        updateMetaTag('property', 'article:author', author);
      }
    } else {
      // Remove stale article properties if navigating back to standard pages
      const publishedTag = document.head.querySelector('meta[property="article:published_time"]');
      if (publishedTag) publishedTag.remove();
      const authorTag = document.head.querySelector('meta[property="article:author"]');
      if (authorTag) authorTag.remove();
    }
  }, [title, description, image, url, type, publishedTime, author]);

  return null;
}
