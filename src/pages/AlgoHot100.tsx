import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { hot100Questions } from '../data/leetHot100';
import type { HotQuestion } from '../data/leetHot100';
import { QuizCard } from '../components/leetcode/QuizCard';
import { Flashcard } from '../components/leetcode/Flashcard';
import { ResultPanel } from '../components/leetcode/ResultPanel';

const STORAGE_KEY = 'leetcode-hot100-progress';
const SETTINGS_KEY = 'leetcode-hot100-settings';

type Hot100Settings = {
    questionCount: number;
    startMode: 'quiz' | 'flashcard';
    questionType: 'all' | 'single' | 'multi' | 'truefalse';
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
    random: boolean;
};

type AnswerState = Record<string, { selectedId: string; correct: boolean }>;

type Mode = 'quiz' | 'flashcard' | 'summary';

export const AlgoHot100: React.FC = () => {
    const [settings, setSettings] = useState<Hot100Settings>({
        questionCount: hot100Questions.length,
        startMode: 'quiz',
        questionType: 'all',
        difficulty: 'All',
        random: true,
    });
    const questions = useMemo(() => {
        const filtered = hot100Questions.filter((question) => {
            const matchType = settings.questionType === 'all' || question.questionType === settings.questionType;
            const matchDifficulty = settings.difficulty === 'All' || question.difficulty === settings.difficulty;
            return matchType && matchDifficulty;
        });
        const limitedCount = Math.max(1, Math.min(settings.questionCount, filtered.length || 1));
        const pool = filtered.length ? filtered.slice() : [];
        if (settings.random && pool.length > 1) {
            for (let i = pool.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
        }
        return pool.length ? pool.slice(0, limitedCount) : [];
    }, [settings.difficulty, settings.questionCount, settings.questionType, settings.random]);
    const [mode, setMode] = useState<Mode>('quiz');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<AnswerState>({});
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        const rawSettings = localStorage.getItem(SETTINGS_KEY);
        if (!rawSettings) return;
        try {
            const parsed = JSON.parse(rawSettings) as Hot100Settings;
            setSettings((prev) => ({
                ...prev,
                questionCount: parsed.questionCount ?? prev.questionCount,
                startMode: parsed.startMode ?? prev.startMode,
                questionType: parsed.questionType ?? prev.questionType,
                difficulty: parsed.difficulty ?? prev.difficulty,
                random: parsed.random ?? prev.random,
            }));
        } catch {
            // ignore settings errors
        }
    }, []);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw) as { answers: AnswerState; currentIndex: number };
            if (parsed.answers) {
                const filteredAnswers = Object.fromEntries(
                    Object.entries(parsed.answers).filter(([id]) => questions.some((question) => question.id === id))
                );
                setAnswers(filteredAnswers);
                const firstUnanswered = questions.findIndex((question) => !filteredAnswers[question.id]);
                setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
            }
            if (typeof parsed.currentIndex === 'number') {
                setCurrentIndex(Math.min(parsed.currentIndex, Math.max(questions.length - 1, 0)));
            }
        } catch {
            // ignore storage errors
        }
    }, [questions]);

    useEffect(() => {
        setMode(settings.startMode);
    }, [settings.startMode]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex }));
    }, [answers, currentIndex]);

    const progress = Math.min(Object.keys(answers).length, questions.length);
    const progressPercent = questions.length ? Math.round((progress / questions.length) * 100) : 0;

    const typeLabelMap: Record<Hot100Settings['questionType'], string> = {
        all: '全部',
        single: '单选',
        multi: '多选',
        truefalse: '判断',
    };

    const currentQuestion: HotQuestion | undefined = questions[currentIndex];
    const selectedOptionId = answers[currentQuestion?.id]?.selectedId;

    const handleSelectOption = (optionId: string) => {
        if (!currentQuestion || selectedOptionId) return;
        const isCorrect = currentQuestion.options.find((option) => option.id === optionId)?.isCorrect ?? false;
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: { selectedId: optionId, correct: isCorrect },
        }));
    };

    const handleNext = () => {
        if (currentIndex >= questions.length - 1) {
            setMode('summary');
            return;
        }
        setCurrentIndex((prev) => prev + 1);
        setFlipped(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
        setFlipped(false);
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentIndex(0);
        setMode(settings.startMode);
        setFlipped(false);
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
                        <div
                            className="h-2 rounded-full bg-amber-400 transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
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
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">提示</p>
                                <p className="mt-2 text-sm text-slate-600">{currentQuestion?.hint ?? '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
