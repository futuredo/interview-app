import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { RefreshCw, BookOpen, Target, Zap, Trophy, Send, MessageCircle, UserRound, Sparkles } from 'lucide-react';
import { QuestionCard } from '../components/QuestionCard';
import type { Question } from '../types';
import { WordCloud } from '../components/WordCloud';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Home: React.FC = () => {
    const { messageBoard, addMessage, questionBank } = useStore();

    const getRandomQuestions = useCallback(() => {
        if (!questionBank.length) return [] as Question[];
        const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10);
    }, [questionBank]);

    const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>(() => []);
    const [isAnimating, setIsAnimating] = useState(false);
    const [contact, setContact] = useState('');
    const [messageDraft, setMessageDraft] = useState('');

    useEffect(() => {
        setDisplayedQuestions(getRandomQuestions());
    }, [getRandomQuestions]);

    const refreshQuestions = useCallback(() => {
        setIsAnimating(true);
        setDisplayedQuestions(getRandomQuestions());
        setTimeout(() => setIsAnimating(false), 500);
    }, [getRandomQuestions]);

    const handleSaveMessage = () => {
        const trimmedContact = contact.trim();
        const trimmedMessage = messageDraft.trim();
        if (!trimmedContact || !trimmedMessage) return;
        addMessage(trimmedContact, trimmedMessage);
        setContact('');
        setMessageDraft('');
    };

    const danmuItems = useMemo(() => messageBoard.slice(0, 20), [messageBoard]);
    const boardList = useMemo(() => messageBoard.slice(0, 30), [messageBoard]);
    const latestMessage = messageBoard[0];
    const totalMessages = messageBoard.length;

    return (
        <div className="flex flex-col gap-12">
            {/* Hero */}
            <section className="text-center py-12 px-4 mt-8 hero-panel">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                    Unity 游戏开发面试宝典
                </h1>
                <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
                    精选高频面试真题，涵盖 C# 基础、Unity 引擎核心、图形学、算法等多个领域。
                    助你查漏补缺，轻松拿下 Offer。
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link to="/challenge" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                        <BookOpen className="w-5 h-5" />
                        开始挑战
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                        <Target className="w-5 h-5" />
                        设定目标
                    </Link>
                </div>
            </section>

            {/* Core Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="surface-card p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow neon-card">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-text-main)]">海量题库</h3>
                    <p className="text-[var(--color-text-secondary)]">收录数百道 Unity 面试真题，持续更新中</p>
                </div>
                <div className="surface-card p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow neon-card">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-text-main)]">每日打卡</h3>
                    <p className="text-[var(--color-text-secondary)]">设定每日学习目标，保持学习节奏</p>
                </div>
                <div className="surface-card p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow neon-card">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-4">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-text-main)]">错题回顾</h3>
                    <p className="text-[var(--color-text-secondary)]">自动记录错题，针对性复习薄弱环节</p>
                </div>
            </section>

            {/* Word Cloud */}
            <section>
                <WordCloud />
            </section>

            {/* Daily Challenge */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-800">每日精选</h2>
                    </div>
                    <button
                        onClick={refreshQuestions}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
                        <span>换一换</span>
                    </button>
                </div>

                {displayedQuestions.length === 0 ? (
                    <div className="text-sm text-[var(--color-text-secondary)]">题库加载中，稍后查看每日精选～</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {displayedQuestions.map((q) => (
                            <QuestionCard key={q.id} question={q} />
                        ))}
                    </div>
                )}
            </section>

            {/* Message Wall & Danmu */}
            <section className="relative">
                <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[#0F172A] via-[#0C1B3A] to-[#0B1225] dark:from-[#0B1225] dark:via-[#0B152C] dark:to-[#0A1120] p-6 md:p-10 shadow-xl shadow-blue-500/10 text-white">
                    <div className="absolute -top-14 -right-10 w-72 h-72 bg-[var(--color-primary)]/25 rounded-full blur-3xl" aria-hidden />
                    <div className="absolute -bottom-16 -left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" aria-hidden />

                    <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold flex items-center gap-2 text-blue-100">
                                        <Sparkles className="w-4 h-4" />
                                        实时留言墙
                                    </p>
                                    <h2 className="text-3xl font-bold text-white mt-1">社区打卡留言区</h2>
                                    <p className="text-sm text-white/70">留下联系方式与 flag，出现在主页底部弹幕</p>
                                </div>
                                <span className="text-sm px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80">
                                    共 {totalMessages} 条
                                </span>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3 text-white/80">
                                    <span className="text-sm">弹幕展示</span>
                                    <span className="text-xs">实时滚动 · {danmuItems.length} 条</span>
                                </div>
                                <div className="danmu-wrapper danmu-large">
                                    <div className="danmu-track">
                                        {danmuItems.length === 0 ? (
                                            <div className="danmu-item">等待第一条留言...</div>
                                        ) : (
                                            danmuItems.map((item, index) => (
                                                <div key={item.id} className="danmu-item" style={{ animationDelay: `${index * 0.6}s` }}>
                                                    <span className="font-semibold">{item.contact}</span>
                                                    <span className="mx-2 text-[var(--color-text-secondary)]">·</span>
                                                    <span>{item.content}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 flex flex-col gap-4 shadow-lg shadow-blue-500/10">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-white/80">联系方式</label>
                                    <input
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        placeholder="微信 / QQ / 邮箱"
                                        className="px-4 py-3 rounded-xl border border-white/25 bg-white/10 text-white placeholder:text-white/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-white/80">留言内容</label>
                                    <textarea
                                        value={messageDraft}
                                        onChange={(e) => setMessageDraft(e.target.value)}
                                        placeholder="分享你的学习目标、打卡成果或功能建议"
                                        className="px-4 py-3 rounded-xl border border-white/25 bg-white/10 text-white placeholder:text-white/50 min-h-[110px] resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveMessage}
                                    className="btn-primary px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-base shadow-blue-500/40"
                                >
                                    <Send className="w-4 h-4" />
                                    投递到弹幕
                                </button>
                                <div className="text-xs text-white/70 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        留言会在审核后自动展示，最新 20 条参与弹幕
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserRound className="w-4 h-4" />
                                        联系作者：微信 Szh24-8 · 期待更多建议
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/5 p-6 flex flex-col gap-5 shadow-xl shadow-blue-900/10 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/70">最新留言</p>
                                    <h3 className="text-2xl font-bold text-white">实时列表</h3>
                                </div>
                                {latestMessage && (
                                    <div className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/15">
                                        最近来自 {latestMessage.contact}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
                                <div className="p-3 rounded-xl border border-white/15 bg-white/5">
                                    <p>最新联系方式</p>
                                    <p className="text-base font-semibold text-white mt-1">{latestMessage?.contact || '等待中'}</p>
                                    <span className="text-xs">{latestMessage ? new Date(latestMessage.createdAt).toLocaleString() : '发布后即刻展示'}</span>
                                </div>
                                <div className="p-3 rounded-xl border border-white/15 bg-white/5">
                                    <p>展示规则</p>
                                    <p className="text-base font-semibold text-white mt-1">前 20 条轮播</p>
                                    <span className="text-xs">其余留言保留在后台</span>
                                </div>
                            </div>

                            <div className="flex-1 max-h-[360px] overflow-y-auto pr-1 space-y-3">
                                {boardList.length === 0 ? (
                                    <div className="text-sm text-white/70">暂无留言，快来占领弹幕首条吧～</div>
                                ) : (
                                    boardList.map((item, index) => (
                                        <div key={item.id} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                                            <div className="flex items-center justify-between text-xs text-white/70">
                                                <span>{new Date(item.createdAt).toLocaleString()}</span>
                                                {index === 0 && <span className="text-[var(--color-primary)] font-medium">最新</span>}
                                            </div>
                                            <div className="mt-2 font-semibold text-white">{item.contact}</div>
                                            <p className="text-sm text-white/80 mt-1">{item.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
