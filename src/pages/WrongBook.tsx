import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { QuestionCard } from '../components/QuestionCard';
import type { Question } from '../types';
import { Filter, Search, X, Trash2 } from 'lucide-react';

export const WrongBook: React.FC = () => {
    const { wrongQuestions, wrongQuestionCounts, clearWrongQuestions, questionBank } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const [sortOrder, setSortOrder] = useState<'default' | 'count-desc' | 'title-asc' | 'title-desc'>('default');

    const questions = useMemo(() => {
        let result = (questionBank as Question[]).filter(q => wrongQuestions.includes(q.id));

        if (difficulty !== 'All') {
            result = result.filter(q => q.difficulty === difficulty);
        }

        if (searchTerm) {
            const keyword = searchTerm.toLowerCase();
            result = result.filter(q => q.title.toLowerCase().includes(keyword) || q.content.toLowerCase().includes(keyword));
        }

        const getTitleNumber = (title: string): number => {
            const match = title.match(/^(\d+)\./);
            return match ? parseInt(match[1]) : 0;
        };

        if (sortOrder === 'count-desc') {
            result = [...result].sort((a, b) => (wrongQuestionCounts[b.id] || 0) - (wrongQuestionCounts[a.id] || 0));
        } else if (sortOrder === 'title-asc') {
            result = [...result].sort((a, b) => getTitleNumber(a.title) - getTitleNumber(b.title));
        } else if (sortOrder === 'title-desc') {
            result = [...result].sort((a, b) => getTitleNumber(b.title) - getTitleNumber(a.title));
        }

        return result;
    }, [difficulty, questionBank, searchTerm, sortOrder, wrongQuestionCounts, wrongQuestions]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">错题回顾</h1>
                        <p className="text-gray-500">
                            共 {questions.length} 道错题待复习
                        </p>
                    </div>
                    <button
                        onClick={clearWrongQuestions}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                    >
                        <Trash2 className="w-4 h-4" />
                        清空错题本
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                        <input
                            type="text"
                            placeholder="搜索错题..."
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
                                {sortOrder === 'default' ? '默认排序' : sortOrder === 'count-desc' ? '错题次数' : sortOrder === 'title-asc' ? '题号正序' : '题号倒序'}
                            </span>
                        </div>
                        <div className="absolute top-full right-0 mt-2 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 p-2">
                            <button onClick={() => setSortOrder('default')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">默认排序</button>
                            <button onClick={() => setSortOrder('count-desc')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">错题次数</button>
                            <button onClick={() => setSortOrder('title-asc')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">题号正序</button>
                            <button onClick={() => setSortOrder('title-desc')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">题号倒序</button>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] cursor-pointer hover:border-[var(--color-primary)] transition-colors min-w-[140px]">
                            <Filter className="w-5 h-5 text-[var(--color-text-secondary)]" />
                            <span className="flex-1 truncate">{difficulty === 'All' ? '全部难度' : difficulty === 'Easy' ? '简单' : difficulty === 'Medium' ? '中等' : '困难'}</span>
                        </div>
                        <div className="absolute top-full right-0 mt-2 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 p-2">
                            <button onClick={() => setDifficulty('All')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">全部难度</button>
                            <button onClick={() => setDifficulty('Easy')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">简单</button>
                            <button onClick={() => setDifficulty('Medium')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">中等</button>
                            <button onClick={() => setDifficulty('Hard')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">困难</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questions.map(q => (
                    <div key={q.id} className="relative">
                        <QuestionCard question={q as unknown as Question} />
                        {(wrongQuestionCounts[q.id] || 0) > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                                {wrongQuestionCounts[q.id]}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {questions.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    太棒了！没有错题。
                </div>
            )}
        </div>
    );
};
