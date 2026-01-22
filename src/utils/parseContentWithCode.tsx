import React from 'react';
import { CodeBlock } from '../components/CodeBlock';

export const parseContentWithCode = (content: string) => {
    const parts = content.split(/(<pre><code class="[^"]+">[\s\S]*?<\/code><\/pre>)/g);

    return parts.map((part, index) => {
        const match = part.match(/<pre><code class="([^"]+)">([\s\S]*?)<\/code><\/pre>/);
        if (match) {
            const language = match[1];
            const code = match[2]
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&#123;/g, '{')
                .replace(/&#125;/g, '}')
                .replace(/&nbsp;/g, ' ');

            return <CodeBlock key={index} code={code} language={language} />;
        }

        if (!part) return null;
        return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
};
