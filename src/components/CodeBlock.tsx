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
    const codeRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    return (
        <div className="relative group rounded-lg overflow-hidden my-4">
            <pre className="!bg-[#1e293b] !p-4 !m-0 overflow-x-auto rounded-lg">
                <code 
                    ref={codeRef}
                    className={`language-${language} !text-[#e2e8f0] !bg-transparent !p-0 font-mono text-sm`}
                >
                    {code}
                </code>
            </pre>
        </div>
    );
};

