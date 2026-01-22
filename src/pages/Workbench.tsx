
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, AlertCircle, RotateCcw } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Question } from '../types';
import clsx from 'clsx';
import { parseContentWithCode } from '../utils/parseContentWithCode';
import { extractQuestionSection, extractAnswerSection } from '../utils/questionContent';
import { ConfirmModal } from '../components/ConfirmModal';

export const Workbench: React.FC = () => {
    const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        completeQuestion,
        setRating,
        starRatings,
        favorites,
        toggleFavorite,
        toggleWrong,
        wrongQuestions,
        resetPracticeCount,
        adminAnswerOverrides,
        questionBank,
        userNotes,
        saveUserNote,
    } = useStore();

    const question = questionBank.find(q => q.id === id) as Question | undefined;
    const currentRating = question ? (starRatings[question.id] || 0) : 0;
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const questionPrompt = question ? extractQuestionSection(question.content) : '';
    const overrideContent = question ? adminAnswerOverrides[question.id] : undefined;
    const extractedAnswer = question ? extractAnswerSection(question.content) : '';
    const finalAnswer = question
        ? (overrideContent?.trim()?.length ? overrideContent : (extractedAnswer.trim().length ? extractedAnswer : question.content))
        : '';
    const questionId = question?.id;
    const userAnswer = questionId ? (answerDrafts[questionId] ?? userNotes[questionId] ?? '') : '';

    if (!question) return <div className="text-center mt-20 text-gray-600">未找到题目</div>;

    const handleRate = (rating: number) => {
        setRating(question.id, rating);
        completeQuestion(question.id);
    };
    return (
        <>
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors font-medium"
                >
                    <ChevronLeft className="w-4 h-4" /> 返回列表
                </button>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
                    {/* Header */}
                    <div className="p-8 border-b border-[var(--color-border)]">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-[var(--color-text-secondary)]">题目标题</span>
                                <h1 className="text-2xl font-bold text-[var(--color-text-main)] leading-tight">
                                    {question.title}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleFavorite(question.id)}
                                    className={clsx(
                                        "p-2 rounded-lg transition-colors",
                                        favorites.includes(question.id) ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                                    )}
                                    title="收藏题目"
                                >
                                    <Star className={clsx("w-6 h-6", favorites.includes(question.id) && "fill-current")} />
                                </button>
                                <button
                                    onClick={() => toggleWrong(question.id)}
                                    className={clsx(
                                        "p-2 rounded-lg transition-colors",
                                        wrongQuestions.includes(question.id) ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                                    )}
                                    title="加入错题本"
                                >
                                    <AlertCircle className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => setResetModalOpen(true)}
                                    className="p-2 rounded-lg transition-colors text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                                    title="清空本题刷题次数"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            {question.tags.map(tag => (
                                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Question Section */}
                    <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-bg)]/40">
                        <div className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">题目</div>
                        <div className="prose dark:prose-invert max-w-none text-[var(--color-text-main)]">
                            {parseContentWithCode(questionPrompt)}
                        </div>
                    </div>

                    {/* Answer Input Section */}
                    <div className="p-8 bg-[var(--color-bg)]/50 border-b border-[var(--color-border)]">
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            你的回答 (可选)
                        </label>
                        <textarea
                            value={userAnswer}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                setAnswerDrafts((prev) => ({
                                    ...prev,
                                    [question.id]: nextValue,
                                }));
                            }}
                            placeholder="在这里尝试写下你的思路..."
                            className="w-full h-32 p-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all resize-none bg-[var(--color-surface)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/50"
                        />
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!questionId) return;
                                    saveUserNote(questionId, userAnswer.trim());
                                }}
                                className="btn-primary px-4 py-2 rounded-lg"
                            >
                                提交答案
                            </button>
                        </div>
                    </div>

                    {/* Answer Display Section */}
                    <div className="p-8 min-h-[200px] space-y-6">
                        {userAnswer && (
                            <div className="bg-[var(--color-bg)] rounded-xl p-6 border border-[var(--color-border)]">
                                <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">你的回答</h3>
                                <p className="text-[var(--color-text-main)] whitespace-pre-wrap">{userAnswer}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-4">参考答案</h3>
                            <div className="prose dark:prose-invert max-w-none text-[var(--color-text-main)]">
                                {finalAnswer.trim()
                                    ? parseContentWithCode(finalAnswer)
                                    : <p className="text-[var(--color-text-secondary)]">暂未录入参考答案。</p>}
                            </div>
                            {finalAnswer.trim() && (
                                <div className="mt-4 text-xs text-[var(--color-text-secondary)] break-words">
                                    （如格式未正常渲染，原始内容预览）
                                    <div dangerouslySetInnerHTML={{ __html: finalAnswer }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-8 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">评分</p>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRate(star)}
                                        className={clsx(
                                            "group flex items-center justify-center p-4 rounded-xl border transition-all w-16 bg-[var(--color-surface)] shadow-sm",
                                            currentRating >= star
                                                ? "border-[var(--color-primary)] ring-2 ring-blue-200 dark:ring-blue-900 text-[var(--color-primary)]"
                                                : "border-[var(--color-border)] hover:border-blue-300 dark:hover:border-blue-700 text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)]"
                                        )}
                                    >
                                        <Star className={clsx("w-6 h-6 transition-transform group-hover:scale-110", currentRating >= star && "fill-current text-yellow-400")} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={resetModalOpen}
                title="清空刷题次数"
                message="确认清空本题的刷题次数记录？此操作不可撤销。"
                confirmText="确认清空"
                cancelText="取消"
                variant="warning"
                onConfirm={() => {
                    if (questionId) {
                        resetPracticeCount(questionId);
                    }
                    setResetModalOpen(false);
                }}
                onCancel={() => setResetModalOpen(false)}
            />
        </>
    );
};
