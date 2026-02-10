import React from 'react';
import type { HotQuestion } from '../../data/leetHot100';

interface ResultPanelProps {
    questions: HotQuestion[];
    answers: Record<string, { selectedId: string; correct: boolean }>;
    onReset: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ questions, answers, onReset }) => {
    const total = questions.length;
    const correctCount = Object.values(answers).filter((item) => item.correct).length;

    const wrongCategories = questions
        .filter((question) => answers[question.id] && !answers[question.id].correct)
        .map((question) => ({ category: question.category, hint: question.hint }));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Summary</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">测验结果</h2>
                </div>
                <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
                    得分 {correctCount} / {total}
                </span>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">学习指南</p>
                {wrongCategories.length === 0 ? (
                    <p className="mt-2">很好！你已经掌握了全部知识点。</p>
                ) : (
                    <ul className="mt-3 space-y-2">
                        {wrongCategories.map((item, index) => (
                            <li key={`${item.category}-${index}`}>
                                <span className="font-semibold text-slate-700">{item.category}</span>
                                <span className="ml-2 text-slate-500">{item.hint}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                type="button"
                onClick={onReset}
                className="mt-5 inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
                重新开始
            </button>
        </div>
    );
};
