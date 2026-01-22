import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Trophy, RefreshCw, Star, AlertCircle, LogOut } from 'lucide-react';
import type { Question } from '../types';
import { parseContentWithCode } from '../utils/parseContentWithCode';
import { CountdownTimer } from '../components/CountdownTimer';
import { useStore } from '../store/useStore';
import { extractQuestionSection, extractAnswerSection } from '../utils/questionContent';
import { ConfirmModal } from '../components/ConfirmModal';

export const Challenge: React.FC = () => {
    const navigate = useNavigate();
    const {
        favorites,
        wrongQuestions,
        toggleFavorite,
        toggleWrong,
        markAsWrong,
        completeQuestion,
        incrementPracticeCount,
        challengeConfig,
        adminAnswerOverrides,
        questionBank,
        userNotes,
        saveUserNote,
    } = useStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeUp, setTimeUp] = useState(false);
    const [totalTimerKey, setTotalTimerKey] = useState(0);
    const [questionTimerKey, setQuestionTimerKey] = useState(0);
    const [activeConfig, setActiveConfig] = useState(challengeConfig);
    const [exitModalOpen, setExitModalOpen] = useState(false);

    const getTitleNumber = (title: string): number => {
        const match = title.match(/^(\d+)\./);
        return match ? parseInt(match[1]) : 0;
    };

    const selectQuestions = useCallback((nextConfig: typeof challengeConfig) => {
        const sourcePool = questionBank.filter(q => {
            if (nextConfig.questionSource === 'favorites' && !favorites.includes(q.id)) return false;
            if (nextConfig.questionSource === 'wrong' && !wrongQuestions.includes(q.id)) return false;
            if (nextConfig.difficulty !== 'All' && q.difficulty !== nextConfig.difficulty) return false;
            return true;
        });

        if (nextConfig.orderMode === 'sequence') {
            const sorted = [...sourcePool].sort((a, b) => getTitleNumber(a.title) - getTitleNumber(b.title));
            return sorted.slice(0, Math.min(nextConfig.questionCount, sorted.length));
        }

        const shuffled = [...sourcePool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(nextConfig.questionCount, sourcePool.length));
    }, [favorites, questionBank, wrongQuestions]);

    const [questions, setQuestions] = useState<Question[]>(() => selectQuestions(challengeConfig));


    const startChallenge = useCallback((nextConfig: typeof challengeConfig) => {
        const updatedConfig = { ...nextConfig };
        setActiveConfig(updatedConfig);
        const selected = selectQuestions(updatedConfig);
        setQuestions(selected);
        setCurrentIndex(0);
        setShowAnswer(false);
        setCompleted(false);
        setScore(0);
        setElapsedSeconds(0);
        setTimeUp(false);
        setStartTime(Date.now());
        setTotalTimerKey(prev => prev + 1);
        setQuestionTimerKey(prev => prev + 1);
    }, [selectQuestions]);

    const handleComplete = () => {
        if (startTime) {
            const seconds = Math.floor((Date.now() - startTime) / 1000);
            setElapsedSeconds(seconds);
        }
        setCompleted(true);
    };

    const handleTimeUp = () => {
        setTimeUp(true);
        handleComplete();
    };

    const handleQuestionTimeUp = () => {
        if (completed) return;
        if (currentIndex < questions.length - 1) {
            handleNext(false);
        } else {
            handleNext(false);
        }
    };

    const handleNext = (rated: boolean) => {
        const currentQuestion = questions[currentIndex];
        incrementPracticeCount(currentQuestion.id);
        if (rated) {
            setScore(s => s + 1);
            completeQuestion(currentQuestion.id);
        } else {
            markAsWrong(currentQuestion.id);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
        } else {
            handleComplete();
        }
    };

    if (questions.length === 0 && !completed) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="surface-card p-8 flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">没有可用题目</h2>
                        <p className="text-[var(--color-text-secondary)]">
                            当前配置下没有题目，请返回设置页调整条件。
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/challenge')}
                        className="btn-primary px-6 py-3 rounded-xl w-fit"
                    >
                        返回设置
                    </button>
                </div>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="max-w-2xl mx-auto text-center pt-12">
                <div className="surface-card p-12 flex flex-col items-center animate-fade-in">
                    <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-4">挑战完成!</h2>
                    <p className="text-xl text-[var(--color-text-secondary)] mb-2">
                        你完成了本次 {questions.length} 道题的挑战
                    </p>
                    <p className="text-lg font-medium text-[var(--color-primary)] mb-2">
                        本次得分: {score} / {questions.length}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-8">
                        用时 {Math.floor(elapsedSeconds / 60)} 分 {elapsedSeconds % 60} 秒{timeUp ? '（时间到）' : ''}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => startChallenge(challengeConfig)}
                            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl"
                        >
                            <RefreshCw className="w-5 h-5" />
                            再来一轮
                        </button>
                        <button
                            onClick={() => navigate('/challenge')}
                            className="btn-secondary px-6 py-3"
                        >
                            返回设置
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const questionPrompt = extractQuestionSection(currentQuestion.content);
    const overrideContent = adminAnswerOverrides[currentQuestion.id];
    const extractedAnswer = extractAnswerSection(currentQuestion.content);
    const finalAnswer = overrideContent?.trim()?.length ? overrideContent : (extractedAnswer.trim().length ? extractedAnswer : currentQuestion.content);
    const isFavorite = favorites.includes(currentQuestion.id);
    const isWrong = wrongQuestions.includes(currentQuestion.id);
    const sourceLabel = activeConfig.questionSource === 'favorites' ? '收藏夹' : activeConfig.questionSource === 'wrong' ? '错题本' : '全量题库';
    const userAnswer = userNotes[currentQuestion.id] || '';

    const handleShowAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAnswer(true);
    };

    return (
        <React.Fragment>
        <div className="max-w-3xl mx-auto">
            <div className="surface-card p-6 mb-6 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                            {sourceLabel}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)]">总时间</span>
                        <CountdownTimer key={totalTimerKey} totalSeconds={activeConfig.totalTimeLimit} onTimeUp={handleTimeUp} />
                        <span className="text-xs text-[var(--color-text-secondary)]">每题时间</span>
                        <CountdownTimer key={`${questionTimerKey}-${currentIndex}`} totalSeconds={activeConfig.perQuestionTimeLimit} onTimeUp={handleQuestionTimeUp} />
                    </div>
                    <button
                        onClick={() => setExitModalOpen(true)}
                        className="btn-ghost text-sm px-4 py-2"
                    >
                        <LogOut className="w-4 h-4" />
                        退出答题
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    <span>挑战进度</span>
                    <span>{currentIndex + 1} / {questions.length}</span>
                </div>
                <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="surface-card overflow-hidden">
                <div className="p-8 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
                            第 {currentIndex + 1} 题
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${currentQuestion.difficulty === 'Easy' ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' :
                            currentQuestion.difficulty === 'Medium' ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' :
                                'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                            }`}>
                            {currentQuestion.difficulty === 'Easy' ? '简单' : currentQuestion.difficulty === 'Medium' ? '中等' : '困难'}
                        </span>
                        <button
                            onClick={() => toggleFavorite(currentQuestion.id)}
                            className={`p-2 rounded-lg border transition-colors ${isFavorite ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-hover)]'}`}
                            title="加入收藏"
                        >
                            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={() => toggleWrong(currentQuestion.id)}
                            className={`p-2 rounded-lg border transition-colors ${isWrong ? 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-hover)]'}`}
                            title="加入错题本"
                        >
                            <AlertCircle className="w-4 h-4" />
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)] leading-relaxed">
                        {currentQuestion.title}
                    </h1>
                </div>

                <div className="p-8 min-h-[300px]">
                    {!showAnswer ? (
                        <div className="flex flex-col gap-6">
                            <div className="prose dark:prose-invert max-w-none text-[var(--color-text-main)]">
                                {parseContentWithCode(questionPrompt)}
                            </div>
                            <div className="bg-[var(--color-bg)]/50 rounded-xl p-6 border border-[var(--color-border)]">
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                                    你的回答 (可选)
                                </label>
                                <textarea
                                    value={userAnswer}
                                    onChange={(e) => {
                                        saveUserNote(currentQuestion.id, e.target.value);
                                    }}
                                    className="w-full h-32 p-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all resize-none bg-[var(--color-surface)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/50"
                                    placeholder="在这里写下你的思路..."
                                />
                            </div>

                            <div className="flex justify-center py-4">
                                <button
                                    type="button"
                                    onClick={handleShowAnswer}
                                    className="btn-primary px-8 py-3 rounded-xl text-lg shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
                                >
                                    查看答案
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="prose dark:prose-invert max-w-none mb-8 text-[var(--color-text-main)]">
                                <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">参考答案</h3>
                                {finalAnswer.trim() ? parseContentWithCode(finalAnswer) : <p className="text-[var(--color-text-secondary)]">暂时没有答案内容。</p>}
                            </div>
                            {finalAnswer.trim() && (
                                <div className="mt-4 text-xs text-[var(--color-text-secondary)] break-words">
                                    （如格式未正常渲染，原始内容预览）
                                    <div dangerouslySetInnerHTML={{ __html: finalAnswer }} />
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-4 pt-8 border-t border-[var(--color-border)]">
                                <p className="text-[var(--color-text-secondary)] font-medium">这道题你掌握了吗？</p>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleNext(false)}
                                        className="btn-ghost px-6 py-2"
                                    >
                                        还需要复习
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleNext(true)}
                                        className="btn-primary px-6 py-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        完全掌握
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <ConfirmModal
            isOpen={exitModalOpen}
            title="确认退出"
            message="退出后本次挑战进度将不被保存。确定要退出吗？"
            confirmText="退出"
            cancelText="继续答题"
            variant="warning"
            onConfirm={() => navigate('/challenge')}
            onCancel={() => setExitModalOpen(false)}
        />
        </React.Fragment>
    );
};
