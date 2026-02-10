import React from 'react';
import { motion } from 'framer-motion';
import type { HotQuestion } from '../../data/leetHot100';

interface FlashcardProps {
    question: HotQuestion;
    flipped: boolean;
    onFlip: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
    question,
    flipped,
    onFlip,
    onPrev,
    onNext,
}) => {
    const correctOption = question.options.find((option) => option.isCorrect);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>Flashcards</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{question.category}</span>
            </div>

            <div className="mt-5" style={{ perspective: '1200px' }}>
                <motion.div
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative h-64 w-full"
                >
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center"
                        style={{ backfaceVisibility: 'hidden' }}
                        onClick={onFlip}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') onFlip();
                        }}
                    >
                        <p className="text-lg font-semibold text-slate-900">{question.question}</p>
                        <span className="mt-3 text-xs text-slate-400">点击翻转查看答案</span>
                    </div>

                    <div
                        className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        onClick={onFlip}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') onFlip();
                        }}
                    >
                        <p className="text-sm text-slate-500">正确答案</p>
                        <p className="mt-2 text-lg font-semibold text-emerald-600">
                            {correctOption ? correctOption.text : '暂无答案'}
                        </p>
                        <p className="mt-4 text-sm text-slate-600">{question.rationale}</p>
                    </div>
                </motion.div>
            </div>

            <div className="mt-5 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onPrev}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-amber-300"
                >
                    上一个
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-amber-300"
                >
                    下一个
                </button>
            </div>
        </div>
    );
};
