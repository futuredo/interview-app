import React, { useMemo } from 'react';
import { interviewKeywords } from '../data/keywords';

interface WordCloudProps {
    maxWords?: number;
}

export const WordCloud: React.FC<WordCloudProps> = ({ maxWords = 40 }) => {
    const keywords = useMemo(() => {
        const seed = maxWords * 9973 + interviewKeywords.length * 97;
        const getRandomValue = (value: number) => {
            const raw = Math.sin(value + seed) * 10000;
            return raw - Math.floor(raw);
        };

        const shuffled = [...interviewKeywords]
            .map((text, index) => ({ text, key: getRandomValue(index + 1) }))
            .sort((a, b) => a.key - b.key)
            .slice(0, maxWords);

        return shuffled.map((item, index) => ({
            text: item.text,
            size: getRandomValue(index + 101) * 1.5 + 1.0,
        }));
    }, [maxWords]);

    const getRandomColor = (index: number) => {
        const colors = [
            'text-[var(--color-primary)]',
            'text-blue-500',
            'text-blue-600',
            'text-sky-600',
            'text-indigo-600',
            'text-slate-600',
            'text-slate-500',
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="w-full bg-[var(--color-surface)] rounded-2xl p-8 shadow-sm border border-[var(--color-border)] mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />
            <h3 className="text-center text-lg font-semibold text-[var(--color-text-secondary)] mb-6 uppercase tracking-wider relative z-10">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    热门考点
                </span>
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 relative z-10">
                {keywords.map((keyword, index) => (
                    <span
                        key={`${keyword.text}-${index}`}
                        className={`${getRandomColor(index)} font-bold transition-all duration-300 cursor-default hover:scale-125 hover:rotate-2 hover:text-[var(--color-primary)] drop-shadow-sm`}
                        style={{
                            fontSize: `${keyword.size}rem`,
                            opacity: 0.8 + (keyword.size * 0.1),
                            textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        {keyword.text}
                    </span>
                ))}
            </div>
        </div>
    );
};
