import React, { useMemo } from 'react';
import { QuestionList } from '../components/QuestionList';
import type { Question } from '../types';
import { Search, Filter, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/PageHeader';

export const QuestionBank: React.FC = () => {
    const { questionBank, questionBankFilters, setQuestionBankFilters, resetQuestionBankFilters } = useStore();
    const { searchTerm, selectedTag, sortOrder } = questionBankFilters;

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
            <PageHeader
                title="全部题库"
                subtitle="按关键词、标签和题号排序快速定位题目。"
                kicker="Question Bank"
                meta={<span>共 {filteredQuestions.length} 道题目</span>}
                actions={(
                    <button
                        onClick={resetQuestionBankFilters}
                        className="btn-ghost px-4 py-2"
                    >
                        重置筛选
                    </button>
                )}
            />

            {/* Search and Filter Bar */}
            <div className="surface-card p-5 md:p-6 flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr_1fr]">
                    <div className="relative">
                        <Search className="input-icon w-5 h-5 text-[var(--color-text-secondary)]" />
                        <input
                            type="text"
                            placeholder="搜索题目..."
                            value={searchTerm}
                            onChange={(e) => setQuestionBankFilters({ searchTerm: e.target.value })}
                            className="input-field pl-10 pr-10"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setQuestionBankFilters({ searchTerm: '' })}
                                aria-label="清除搜索"
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
                            <button onClick={() => setQuestionBankFilters({ sortOrder: 'default' })} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">默认排序</button>
                            <button onClick={() => setQuestionBankFilters({ sortOrder: 'asc' })} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">题号正序</button>
                            <button onClick={() => setQuestionBankFilters({ sortOrder: 'desc' })} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">题号倒序</button>
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
                                onClick={() => setQuestionBankFilters({ selectedTag: null })}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedTag ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-[var(--color-text-main)] hover:bg-[var(--color-hover)]'}`}
                            >
                                所有标签
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setQuestionBankFilters({ selectedTag: tag })}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTag === tag ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-[var(--color-text-main)] hover:bg-[var(--color-hover)]'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                    <span className="rounded-full bg-[var(--color-bg)] px-3 py-1">标签 {allTags.length} 个</span>
                    {selectedTag && <span className="rounded-full bg-[var(--color-bg)] px-3 py-1">当前：{selectedTag}</span>}
                    {searchTerm && <span className="rounded-full bg-[var(--color-bg)] px-3 py-1">关键词：{searchTerm}</span>}
                </div>
            </div>

            <QuestionList questions={filteredQuestions} showIndex={true} />
        </div>
    );
};
