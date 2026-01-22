import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ChallengeSetup: React.FC = () => {
    const navigate = useNavigate();
    const { favorites, wrongQuestions, challengeConfig, setChallengeConfig, questionBank } = useStore();
    const [configDraft, setConfigDraft] = useState(challengeConfig);

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
                        <label className="text-sm text-[var(--color-text-secondary)]">题目来源</label>
                        <select
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
                        <label className="text-sm text-[var(--color-text-secondary)]">题量</label>
                        <select
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
                        <label className="text-sm text-[var(--color-text-secondary)]">难度</label>
                        <select
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
                        <label className="text-sm text-[var(--color-text-secondary)]">总时间</label>
                        <select
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
                        <label className="text-sm text-[var(--color-text-secondary)]">每题时间</label>
                        <select
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
                        <label className="text-sm text-[var(--color-text-secondary)]">出题顺序</label>
                        <select
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
        </div>
    );
};
