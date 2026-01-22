import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2 } from 'lucide-react';
import type { Question } from '../types';
import { useStore } from '../store/useStore';


interface Props {
    question: Question;
}

export const QuestionCard: React.FC<Props> = ({ question }) => {
    const { completedQuestions, starRatings } = useStore();
    const isCompleted = completedQuestions.includes(question.id);
    const rating = starRatings[question.id] || 0;

    const renderStars = (count: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`w-3 h-3 ${index < count ? 'text-yellow-400 fill-current' : 'text-[var(--color-text-secondary)]/40'}`}
            />
        ));
    };

    return (
        <Link
            to={`/question/${question.id}`}
            className="block group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-primary)] transition-all hover:shadow-lg hover:shadow-blue-500/10"
        >
            <div className="flex justify-between items-start gap-4">
                <h3 className="font-semibold text-lg text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {question.title}
                </h3>
                {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {question.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-md bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                        >
                            {tag}
                        </span>
                    ))}
                    {question.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 text-[var(--color-text-secondary)]">+{question.tags.length - 3}</span>
                    )}
                </div>

                {rating > 0 && (
                    <div className="flex items-center gap-1">
                        {renderStars(rating)}
                    </div>
                )}
            </div>
        </Link>
    );
};
