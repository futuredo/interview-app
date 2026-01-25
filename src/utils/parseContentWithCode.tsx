import { CodeBlock } from '../components/CodeBlock';

export const parseContentWithCode = (content: string) => {
    const parts = content.split(/(<pre><code class="[^"]+">[\s\S]*?<\/code><\/pre>)/g);

    return parts.map((part, index) => {
        const match = part.match(/<pre><code class="([^"]+)">([\s\S]*?)<\/code><\/pre>/);
        if (match) {
            const language = match[1];
            let code = match[2]
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&#123;/g, '{')
                .replace(/&#125;/g, '}')
                .replace(/&nbsp;/g, ' ');

            // Format code if it doesn't have newlines - add breaks at appropriate places
            if (!code.includes('\n')) {
                code = code
                    // First, replace 4+ consecutive spaces with newlines (they represent logical breaks)
                    .replace(/\s{4,}/g, '\n')
                    // Add newline after comments (single line: // xxx)
                    .replace(/(\/\/[^\n]*?)(\s*)(public|private|protected|class|interface|void|int|string|float|bool|using|namespace)/g, '$1\n$3')
                    // Add newline before comments at start or after code
                    .replace(/([;{}])(\s*)(\/\/)/g, '$1\n$3')
                    // Add newline after opening braces
                    .replace(/\{(\s*)([^}\s])/g, '{\n    $2')
                    // Add newline before closing braces
                    .replace(/([^\s{])(\s*)\}/g, '$1\n}')
                    // Add newline after semicolons (but not in for loops)
                    .replace(/;(\s*)([^;\s])/g, ';\n$2')
                    // Fix indentation for common patterns
                    .replace(/\n(\s*)(public|private|protected|void|int|string|class|interface)/g, '\n$2')
                    .replace(/\n(\s*)(\/\/)/g, '\n$2')
                    // Clean up excessive newlines
                    .replace(/\n{3,}/g, '\n\n')
                    .trim();
            }

            return <CodeBlock key={index} code={code} language={language} />;
        }

        if (!part) return null;
        return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
};
