import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';

const HOT100_SETTINGS_KEY = 'leetcode-hot100-settings';

const defaultHot100Settings: Hot100Settings = {
    questionCount: 3,
    startMode: 'quiz',
    questionType: 'single',
    difficulty: 'All',
    random: true,
};

const getInitialHot100Settings = (): Hot100Settings => {
    if (typeof window === 'undefined') return defaultHot100Settings;
    const rawSettings = localStorage.getItem(HOT100_SETTINGS_KEY);
    if (!rawSettings) return defaultHot100Settings;
    try {
        const parsed = JSON.parse(rawSettings) as Hot100Settings;
        return {
            ...defaultHot100Settings,
            questionCount: parsed.questionCount ?? defaultHot100Settings.questionCount,
            startMode: parsed.startMode ?? defaultHot100Settings.startMode,
            questionType: parsed.questionType ?? defaultHot100Settings.questionType,
            difficulty: parsed.difficulty ?? defaultHot100Settings.difficulty,
            random: parsed.random ?? defaultHot100Settings.random,
        };
    } catch {
        return defaultHot100Settings;
    }
};

type Hot100Settings = {
    questionCount: number;
    startMode: 'quiz' | 'flashcard';
    questionType: 'all' | 'single' | 'multi' | 'truefalse';
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
    random: boolean;
};

export const ChallengeSetup: React.FC = () => {
    const navigate = useNavigate();
    const { favorites, wrongQuestions, challengeConfig, setChallengeConfig, questionBank } = useStore();
    const [configDraft, setConfigDraft] = useState(challengeConfig);
    const [hot100Settings, setHot100Settings] = useState<Hot100Settings>(getInitialHot100Settings);

    const filteredPool = useMemo(() => {
        let pool = questionBank;

        if (configDraft.questionSource === 'favorites') {
            pool = pool.filter(q => favorites.includes(q.id));
        } else if (configDraft.questionSource === 'wrong') {
            pool = pool.filter(q => wrongQuestions.includes(q.id));
        }

        if (configDraft.difficulty !== 'All') {
            pool = pool.filter(q => q.difficulty === configDraft.difficulty);
        }

        return pool;
    }, [configDraft, favorites, questionBank, wrongQuestions]);

    const handleStart = () => {
        setChallengeConfig(configDraft);
        navigate('/challenge/play');
    };

    const handleStartHot100 = () => {
        localStorage.setItem(HOT100_SETTINGS_KEY, JSON.stringify(hot100Settings));
        navigate('/challenge/hot100');
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-main)]">挑战设置</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">配置题量、难度与计时规则</p>
                </div>
            </div>

            <div className="surface-card p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="challenge-source" className="text-sm text-[var(--color-text-secondary)]">题目来源</label>
                        <select
                            id="challenge-source"
                            value={configDraft.questionSource}
                            onChange={(e) => setConfigDraft({ ...configDraft, questionSource: e.target.value as typeof configDraft.questionSource })}
                            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        >
                            <option value="all">全部题库</option>
                            <option value="favorites">仅收藏夹</option>
                            <option value="wrong">仅错题本</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="challenge-count" className="text-sm text-[var(--color-text-secondary)]">题量</label>
                        <select
                            id="challenge-count"
                            value={configDraft.questionCount}
                            onChange={(e) => setConfigDraft({ ...configDraft, questionCount: Number(e.target.value) as typeof configDraft.questionCount })}
                            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        >
                            {[5, 10, 15, 20].map(count => (
                                <option key={count} value={count}>{count} 题</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="challenge-difficulty" className="text-sm text-[var(--color-text-secondary)]">难度</label>
                        <select
                            id="challenge-difficulty"
                            value={configDraft.difficulty}
                            onChange={(e) => setConfigDraft({ ...configDraft, difficulty: e.target.value as typeof configDraft.difficulty })}
                            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        >
                            <option value="All">全部</option>
                            <option value="Easy">简单</option>
                            <option value="Medium">中等</option>
                            <option value="Hard">困难</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="challenge-total-time" className="text-sm text-[var(--color-text-secondary)]">总时间</label>
                        <select
                            id="challenge-total-time"
                            value={configDraft.totalTimeLimit}
                            onChange={(e) => setConfigDraft({ ...configDraft, totalTimeLimit: Number(e.target.value) })}
                            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        >
                            <option value={0}>不限时</option>
                            <option value={300}>5 分钟</option>
                            <option value={600}>10 分钟</option>
                            <option value={900}>15 分钟</option>
                            <option value={1200}>20 分钟</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="challenge-per-time" className="text-sm text-[var(--color-text-secondary)]">每题时间</label>
                        <select
                            id="challenge-per-time"
                            value={configDraft.perQuestionTimeLimit}
                            onChange={(e) => setConfigDraft({ ...configDraft, perQuestionTimeLimit: Number(e.target.value) })}
                            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        >
                            <option value={0}>不限时</option>
                            <option value={60}>1 分钟</option>
                            <option value={120}>2 分钟</option>
                            <option value={180}>3 分钟</option>
                            <option value={300}>5 分钟</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="challenge-order" className="text-sm text-[var(--color-text-secondary)]">出题顺序</label>
                        <select
                            id="challenge-order"
                            value={configDraft.orderMode}
                            onChange={(e) => setConfigDraft({ ...configDraft, orderMode: e.target.value as typeof configDraft.orderMode })}
                            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        >
                            <option value="random">随机</option>
                            <option value="sequence">按序</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={handleStart} className="btn-primary px-6 py-3 rounded-xl">
                        开始挑战
                    </button>
                    <span className="text-xs text-[var(--color-text-secondary)]">当前池子：{filteredPool.length} 题</span>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Code2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">LeetCode Hot 100</p>
                            <h2 className="mt-1 text-xl font-semibold text-slate-900">算法挑战小区域</h2>
                            <p className="mt-2 text-sm text-slate-500">
                                自定义题量与模式，进入算法测验与抽认卡训练。
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleStartHot100}
                        className="inline-flex items-center rounded-full bg-amber-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                    >
                        进入挑战
                    </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="hot100-count" className="text-sm text-slate-500">题量</label>
                        <select
                            id="hot100-count"
                            value={hot100Settings.questionCount}
                            onChange={(e) => setHot100Settings((prev) => ({
                                ...prev,
                                questionCount: Number(e.target.value),
                            }))}
                            className="select-field"
                        >
                            {[3, 5, 10, 20, 50, 100, 200].map((count) => (
                                <option key={count} value={count}>
                                    {count} 题
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="hot100-mode" className="text-sm text-slate-500">起始模式</label>
                        <select
                            id="hot100-mode"
                            value={hot100Settings.startMode}
                            onChange={(e) => setHot100Settings((prev) => ({
                                ...prev,
                                startMode: e.target.value as 'quiz' | 'flashcard',
                            }))}
                            className="select-field"
                        >
                            <option value="quiz">测验模式</option>
                            <option value="flashcard">抽认卡模式</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="hot100-type" className="text-sm text-slate-500">题型</label>
                        <select
                            id="hot100-type"
                            value={hot100Settings.questionType}
                            onChange={(e) => setHot100Settings((prev) => ({
                                ...prev,
                                questionType: e.target.value as Hot100Settings['questionType'],
                            }))}
                            className="select-field"
                        >
                            <option value="all">全部题型</option>
                            <option value="single">单选</option>
                            <option value="truefalse">判断</option>
                            <option value="multi">多选</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="hot100-difficulty" className="text-sm text-slate-500">难度</label>
                        <select
                            id="hot100-difficulty"
                            value={hot100Settings.difficulty}
                            onChange={(e) => setHot100Settings((prev) => ({
                                ...prev,
                                difficulty: e.target.value as Hot100Settings['difficulty'],
                            }))}
                            className="select-field"
                        >
                            <option value="All">全部</option>
                            <option value="Easy">简单</option>
                            <option value="Medium">中等</option>
                            <option value="Hard">困难</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-slate-500">随机顺序</label>
                        <button
                            type="button"
                            onClick={() => setHot100Settings((prev) => ({
                                ...prev,
                                random: !prev.random,
                            }))}
                            className={`inline-flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${hot100Settings.random
                                ? 'border-amber-300 bg-amber-50 text-amber-700'
                                : 'border-slate-200 text-slate-500'
                                }`}
                        >
                            <span>{hot100Settings.random ? '随机' : '按固定顺序'}</span>
                            <span className="text-xs">{hot100Settings.random ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">即时反馈解析</div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">进度追踪 + 统计</div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">Flashcards 复习</div>
                </div>
            </div>
        </div>
    );
};
