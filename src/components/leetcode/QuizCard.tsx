import React from 'react';
import type { HotQuestion } from '../../data/leetHot100';

interface QuizCardProps {
    question: HotQuestion;
    selectedOptionId?: string;
    onSelect: (optionId: string) => void;
    onNext: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
    question,
    selectedOptionId,
    onSelect,
    onNext,
}) => {
    const correctOption = question.options.find((option) => option.isCorrect);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Quiz Mode</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                    {question.category}
                </span>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900 leading-relaxed">
                {question.question}
            </h2>

            <div className="mt-5 grid gap-3">
                {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = option.isCorrect;
                    const showFeedback = Boolean(selectedOptionId);

                    let styleClass = 'border-slate-200 text-slate-700 hover:border-amber-300';
                    if (showFeedback) {
                        if (isCorrect) {
                            styleClass = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                        } else if (isSelected && !isCorrect) {
                            styleClass = 'border-rose-400 bg-rose-50 text-rose-600';
                        }
                    }

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onSelect(option.id)}
                            disabled={Boolean(selectedOptionId)}
                            className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${styleClass}`}
                        >
                            {option.text}
                        </button>
                    );
                })}
            </div>

            {selectedOptionId && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-700">解析</p>
                    <p className="mt-2 leading-relaxed">{question.rationale}</p>
                    {correctOption && (
                        <p className="mt-3 text-emerald-600">正确答案：{correctOption.text}</p>
                    )}
                    <button
                        type="button"
                        onClick={onNext}
                        className="mt-4 inline-flex items-center rounded-full bg-amber-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                    >
                        下一题
                    </button>
                </div>
            )}
        </div>
    );
};
