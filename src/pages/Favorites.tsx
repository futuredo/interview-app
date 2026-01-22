import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { QuestionList } from '../components/QuestionList';
import type { Question } from '../types';
import { Star, Search, X, Filter, Trash2 } from 'lucide-react';

export const Favorites: React.FC = () => {
    const { favorites, starRatings, clearFavorites, questionBank } = useStore();
    const [ratingFilter, setRatingFilter] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'default' | 'title-asc' | 'title-desc' | 'rating-desc'>('default');

    const favoriteQuestions = useMemo(() => {
        let result = (questionBank as Question[]).filter(q => favorites.includes(q.id));

        if (searchTerm) {
            const keyword = searchTerm.toLowerCase();
            result = result.filter(q => q.title.toLowerCase().includes(keyword) || q.content.toLowerCase().includes(keyword));
        }

        const getTitleNumber = (title: string): number => {
            const match = title.match(/^(\d+)\./);
            return match ? parseInt(match[1]) : 0;
        };

        if (sortOrder === 'title-asc') {
            result = [...result].sort((a, b) => getTitleNumber(a.title) - getTitleNumber(b.title));
        } else if (sortOrder === 'title-desc') {
            result = [...result].sort((a, b) => getTitleNumber(b.title) - getTitleNumber(a.title));
        } else if (sortOrder === 'rating-desc') {
            result = [...result].sort((a, b) => (starRatings[b.id] || 0) - (starRatings[a.id] || 0));
        }

        return result;
    }, [favorites, questionBank, searchTerm, sortOrder, starRatings]);

    const ratedQuestions = useMemo(() => {
        let result = favoriteQuestions.filter(q => (starRatings[q.id] || 0) > 0);
        if (ratingFilter > 0) {
            result = result.filter(q => (starRatings[q.id] || 0) === ratingFilter);
        }
        return result;
    }, [favoriteQuestions, ratingFilter, starRatings]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-main)]">我的收藏</h1>
                        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                            共 {favoriteQuestions.length} 道收藏题目 / 已评分 {ratedQuestions.length} 道
                        </p>
                    </div>
                </div>
                <button
                    onClick={clearFavorites}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                >
                    <Trash2 className="w-4 h-4" />
                    清空收藏
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                        type="text"
                        placeholder="搜索收藏题目..."
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
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] cursor-pointer hover:border-[var(--color-primary)] transition-colors min-w-[160px]">
                        <Filter className="w-5 h-5 text-[var(--color-text-secondary)]" />
                        <span className="flex-1 truncate">
                            {sortOrder === 'default' ? '默认排序' : sortOrder === 'title-asc' ? '题号正序' : sortOrder === 'title-desc' ? '题号倒序' : '评分优先'}
                        </span>
                    </div>
                    <div className="absolute top-full right-0 mt-2 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 p-2">
                        <button onClick={() => setSortOrder('default')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">默认排序</button>
                        <button onClick={() => setSortOrder('title-asc')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">题号正序</button>
                        <button onClick={() => setSortOrder('title-desc')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">题号倒序</button>
                        <button onClick={() => setSortOrder('rating-desc')} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-hover)] text-[var(--color-text-main)]">评分优先</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="surface-card p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[var(--color-text-main)]">收藏列表</h2>
                        <span className="text-sm text-[var(--color-text-secondary)]">{favoriteQuestions.length} 题</span>
                    </div>
                    {favoriteQuestions.length > 0 ? (
                        <QuestionList questions={favoriteQuestions} showIndex={true} />
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-[var(--color-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-[var(--color-text-secondary)] opacity-50" />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-1">暂无收藏</h3>
                            <p className="text-[var(--color-text-secondary)] text-sm">在答题时点击星星图标即可收藏题目</p>
                        </div>
                    )}
                </div>

                <div className="surface-card p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[var(--color-text-main)]">评分列表</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-[var(--color-text-secondary)]">筛选评分:</span>
                            <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
                                {[0, 1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRatingFilter(star)}
                                        className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${ratingFilter === star
                                                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]'
                                            }`}
                                    >
                                        {star === 0 ? '全部' : `${star}★`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {ratedQuestions.length > 0 ? (
                        <QuestionList questions={ratedQuestions} showIndex={true} />
                    ) : (
                        <div className="text-center py-16 text-[var(--color-text-secondary)]">
                            暂无评分题目
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
