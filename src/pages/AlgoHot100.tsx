import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { hot100Questions } from '../data/leetHot100.ts';
import type { HotQuestion } from '../data/leetHot100.ts';
import { QuizCard } from '../components/leetcode/QuizCard';
import { Flashcard } from '../components/leetcode/Flashcard';
import { ResultPanel } from '../components/leetcode/ResultPanel';

const STORAGE_KEY = 'leetcode-hot100-progress';

type Hot100Settings = {
    questionCount: number;
    startMode: 'quiz' | 'flashcard';
    questionType: 'all' | 'single' | 'multi' | 'truefalse';
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
    random: boolean;
};

type AnswerState = Record<string, { selectedId: string; correct: boolean }>;

type Mode = 'quiz' | 'flashcard' | 'summary';

const DEFAULT_SETTINGS: Hot100Settings = {
    questionCount: hot100Questions.length,
    startMode: 'quiz',
    questionType: 'all',
    difficulty: 'All',
    random: true,
};

const SETTINGS_STORAGE_KEY = 'leetcode-hot100-settings';
const RANDOM_SEED_KEY = 'leetcode-hot100-seed';

const getInitialSettings = (): Hot100Settings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!rawSettings) return DEFAULT_SETTINGS;
    try {
        const parsed = JSON.parse(rawSettings) as Hot100Settings;
        return {
            ...DEFAULT_SETTINGS,
            questionCount: parsed.questionCount ?? DEFAULT_SETTINGS.questionCount,
            startMode: parsed.startMode ?? DEFAULT_SETTINGS.startMode,
            questionType: parsed.questionType ?? DEFAULT_SETTINGS.questionType,
            difficulty: parsed.difficulty ?? DEFAULT_SETTINGS.difficulty,
            random: parsed.random ?? DEFAULT_SETTINGS.random,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
};

const getInitialRandomSeed = (): number => {
    if (typeof window === 'undefined') return 1;
    const rawSeed = localStorage.getItem(RANDOM_SEED_KEY);
    if (rawSeed) {
        const parsed = Number(rawSeed);
        if (Number.isFinite(parsed)) return parsed;
    }
    const seed = Date.now() % 4294967296;
    localStorage.setItem(RANDOM_SEED_KEY, String(seed));
    return seed;
};

const shuffleWithSeed = <T,>(items: T[], seed: number): T[] => {
    const result = items.slice();
    let currentSeed = seed >>> 0;
    const nextRandom = () => {
        currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
        return currentSeed / 4294967296;
    };
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(nextRandom() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

export const AlgoHot100: React.FC = () => {
    const [settings] = useState<Hot100Settings>(getInitialSettings);
    const [randomSeed] = useState<number>(getInitialRandomSeed);
    const questions = useMemo(() => {
        const filtered = hot100Questions.filter((question: HotQuestion) => {
            const matchType = settings.questionType === 'all' || question.questionType === settings.questionType;
            const matchDifficulty = settings.difficulty === 'All' || question.difficulty === settings.difficulty;
            return matchType && matchDifficulty;
        });
        const pool = settings.random ? shuffleWithSeed(filtered, randomSeed) : filtered.slice();
        const limitedCount = Math.max(1, Math.min(settings.questionCount, pool.length || 1));
        return pool.length ? pool.slice(0, limitedCount) : [];
    }, [randomSeed, settings.difficulty, settings.questionCount, settings.questionType, settings.random]);
    const [mode, setMode] = useState<Mode>(() => settings.startMode);
    const [currentIndex, setCurrentIndex] = useState(() => {
        if (typeof window === 'undefined') return 0;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return 0;
        try {
            const parsed = JSON.parse(raw) as { currentIndex: number };
            return typeof parsed.currentIndex === 'number' ? parsed.currentIndex : 0;
        } catch {
            return 0;
        }
    });
    const [answers, setAnswers] = useState<AnswerState>(() => {
        if (typeof window === 'undefined') return {};
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        try {
            const parsed = JSON.parse(raw) as { answers: AnswerState };
            return parsed.answers ?? {};
        } catch {
            return {};
        }
    });
    const [flipped, setFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    const safeIndex = Math.min(currentIndex, Math.max(questions.length - 1, 0));
    const progress = Math.min(Object.keys(answers).length, questions.length);
    const progressPercent = questions.length ? Math.round((progress / questions.length) * 100) : 0;

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex }));
    }, [answers, currentIndex]);

    useEffect(() => {
        if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progressPercent}%`;
        }
    }, [progressPercent]);

    const typeLabelMap: Record<Hot100Settings['questionType'], string> = {
        all: '全部',
        single: '单选',
        multi: '多选',
        truefalse: '判断',
    };

    const currentQuestion: HotQuestion | undefined = questions[safeIndex];
    const selectedOptionId = answers[currentQuestion?.id]?.selectedId;

    const handleSelectOption = (optionId: string) => {
        if (!currentQuestion || selectedOptionId) return;
        const isCorrect = currentQuestion.options.find((option: HotQuestion['options'][number]) => option.id === optionId)?.isCorrect ?? false;
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: { selectedId: optionId, correct: isCorrect },
        }));
    };

    const handleNext = () => {
        if (safeIndex >= questions.length - 1) {
            setMode('summary');
            return;
        }
        setCurrentIndex((prev) => prev + 1);
        setFlipped(false);
        setShowHint(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
        setFlipped(false);
        setShowHint(false);
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentIndex(0);
        setMode(settings.startMode);
        setFlipped(false);
        setShowHint(false);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">LeetCode Hot 100</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">算法测验训练区</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            极简风格的练习入口，包含测验模式、抽认卡与学习指南。
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMode('quiz')}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${mode === 'quiz'
                                ? 'bg-amber-500 text-white'
                                : 'border border-slate-200 text-slate-600 hover:border-amber-300'
                                }`}
                        >
                            测验模式
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('flashcard')}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${mode === 'flashcard'
                                ? 'bg-amber-500 text-white'
                                : 'border border-slate-200 text-slate-600 hover:border-amber-300'
                                }`}
                        >
                            抽认卡
                        </button>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            进度追踪
                        </div>
                        <span>{progress} / {questions.length} 已完成</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white">
                        <div ref={progressBarRef} className="h-2 rounded-full bg-amber-400 transition-all" />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                        题型：{typeLabelMap[settings.questionType]}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                        难度：{settings.difficulty}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                        顺序：{settings.random ? '随机' : '固定'}
                    </span>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div>
                        {questions.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                                当前筛选没有题目，请返回挑战设置调整题型或难度。
                            </div>
                        ) : mode === 'summary' ? (
                            <ResultPanel questions={questions} answers={answers} onReset={handleReset} />
                        ) : mode === 'flashcard' ? (
                            <Flashcard
                                question={currentQuestion}
                                flipped={flipped}
                                onFlip={() => setFlipped((prev) => !prev)}
                                onPrev={handlePrev}
                                onNext={handleNext}
                            />
                        ) : (
                            <QuizCard
                                question={currentQuestion}
                                selectedOptionId={selectedOptionId}
                                onSelect={handleSelectOption}
                                onNext={handleNext}
                            />
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">即时反馈</p>
                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            {!currentQuestion ? (
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Lightbulb className="w-4 h-4" />
                                    暂无题目。
                                </div>
                            ) : !selectedOptionId ? (
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Lightbulb className="w-4 h-4" />
                                    选择一个选项获取解析。
                                </div>
                            ) : answers[currentQuestion.id]?.correct ? (
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    回答正确！继续保持节奏。
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-rose-500">
                                    <XCircle className="w-4 h-4" />
                                    回答有误，看看解析再来。
                                </div>
                            )}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">提示</p>
                                    {currentQuestion && !showHint ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowHint(true)}
                                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 transition hover:border-amber-300 hover:text-amber-600"
                                        >
                                            查看提示
                                        </button>
                                    ) : null}
                                </div>
                                <p className="mt-2 text-sm text-slate-600">
                                    {!currentQuestion ? '—' : showHint ? currentQuestion.hint : '点击查看提示'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
