import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'csharp' }) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);

    // Simple formatter to add newlines after semicolons if the code is a single line
    // This is a heuristic to fix the "one long line" issue from the JSON data
    const formatCode = (input: string) => {
        if (input.includes('\n')) return input; // Already has newlines
        return input.replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '\n}');
    };

    const formattedCode = formatCode(code);

    return (
        <div className="relative group rounded-lg overflow-hidden my-4">
            <pre className="!bg-[#1e293b] !p-4 !m-0 overflow-x-auto rounded-lg">
                <code className={`language-${language} !text-[#e2e8f0] !bg-transparent !p-0 font-mono text-sm`}>
                    {formattedCode}
                </code>
            </pre>
        </div>
    );
};

