import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Question } from '../types';

interface QuestionListProps {
    questions: Question[];
    showIndex?: boolean;
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions, showIndex = true }) => {
    const { completedQuestions, favorites, wrongQuestions, wrongQuestionCounts, starRatings, practiceCounts } = useStore();

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'Medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Hard':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return '简单';
            case 'Medium':
                return '中等';
            case 'Hard':
                return '困难';
            default:
                return difficulty;
        }
    };

    const renderStars = (count: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`w-3 h-3 ${index < count ? 'text-yellow-400 fill-current' : 'text-[var(--color-text-secondary)]/40'}`}
            />
        ));
    };

    return (
        <div className="question-list space-y-3">
            {questions.map((question, index) => {
                const isCompleted = completedQuestions.includes(question.id);
                const isFavorite = favorites.includes(question.id);
                const isWrong = wrongQuestions.includes(question.id);
                const wrongCount = wrongQuestionCounts[question.id] || 0;
                const rating = starRatings[question.id] || 0;
                const practiceCount = practiceCounts[question.id] || 0;

                return (
                    <Link
                        key={question.id}
                        to={`/question/${question.id}`}
                        className="block group"
                    >
                        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                            {/* 序号 */}
                            {showIndex && (
                                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-mono text-sm font-medium">
                                    {index + 1}
                                </span>
                            )}

                            {/* 标题和标签 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[var(--color-text-main)] font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">
                                        {question.title}
                                    </h3>
                                    {isCompleted && (
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    )}
                                    {isFavorite && (
                                        <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                                    )}
                                    {isWrong && (
                                        <div className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex-shrink-0">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>错题</span>
                                        </div>
                                    )}
                                    {wrongCount > 0 && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-500 text-white flex-shrink-0">
                                            {wrongCount}
                                        </span>
                                    )}
                                    {practiceCount > 0 && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500 text-white flex-shrink-0">
                                            刷 {practiceCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(question.difficulty)}`}>
                                        {getDifficultyText(question.difficulty)}
                                    </span>
                                    {rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            {renderStars(rating)}
                                        </div>
                                    )}
                                    {question.tags.slice(0, 3).map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 箭头 */}
                            <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
