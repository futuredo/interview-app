import React, { useState, useMemo } from 'react';
import { QuestionList } from '../components/QuestionList';
import type { Question } from '../types';
import { Search, Filter, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const QuestionBank: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
    const questionBank = useStore((state) => state.questionBank);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        questionBank.forEach(q => {
            q.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [questionBank]);

    // Filter and Sort questions
    const filteredQuestions = useMemo(() => {
        const result = questionBank.filter((q: Question) => {
            const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.content.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTag = selectedTag ? q.tags.includes(selectedTag) : true;
            return matchesSearch && matchesTag;
        });

        const getTitleNumber = (title: string): number => {
            const match = title.match(/^(\d+)\./);
            return match ? parseInt(match[1]) : 0;
        };

        if (sortOrder === 'asc') {
            return [...result].sort((a, b) => getTitleNumber(a.title) - getTitleNumber(b.title));
        }
        if (sortOrder === 'desc') {
            return [...result].sort((a, b) => getTitleNumber(b.title) - getTitleNumber(a.title));
        }

        return result;
    }, [questionBank, searchTerm, selectedTag, sortOrder]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-[var(--color-text-main)]">全部题库</h1>
                    <span className="text-[var(--color-text-secondary)] text-sm">共 {filteredQuestions.length} 道题目</span>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                        <input
                            type="text"
                            placeholder="搜索题目..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--color-hover)] rounded-full text-[var(--color-text-secondary)]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="relative group">
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] cursor-pointer hover:border-[var(--color-primary)] transition-colors min-w-[140px]">
                            <Filter className="w-5 h-5 text-[var(--color-text-secondary)]" />
                            <span className="flex-1 truncate">
                                {sortOrder === 'default' ? '默认排序' : sortOrder === 'asc' ? '题号正序' : '题号倒序'}
                            </span>
                        </div>

                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 p-2">
                            <button onClick={() => setSortOrder('default')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">默认排序</button>
                            <button onClick={() => setSortOrder('asc')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">题号正序</button>
                            <button onClick={() => setSortOrder('desc')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">题号倒序</button>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] cursor-pointer hover:border-[var(--color-primary)] transition-colors min-w-[160px]">
                            <Filter className="w-5 h-5 text-[var(--color-text-secondary)]" />
                            <span className="flex-1 truncate">{selectedTag || '所有标签'}</span>
                        </div>

                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 p-2">
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedTag ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-[var(--color-text-main)] hover:bg-[var(--color-hover)]'}`}
                            >
                                所有标签
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTag === tag ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-[var(--color-text-main)] hover:bg-[var(--color-hover)]'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <QuestionList questions={filteredQuestions} showIndex={true} />
        </div>
    );
};
