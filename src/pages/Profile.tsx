import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { fetchUserProfile, upsertUserProfile } from '../utils/supabaseApi';
import { Trophy, Calendar, Target, Zap, Settings, NotebookPen, Trash2, Activity, Layers, Flame, Star, Camera } from 'lucide-react';

export const Profile: React.FC = () => {
    const {
        completedQuestions,
        dailyCheckins,
        dailyGoal,
        setDailyGoal,
        userLogs,
        addUserLog,
        removeUserLog,
        favorites,
        wrongQuestions,
        practiceCounts,
        profile,
        setProfile,
        authUser,
        questionBank,
    } = useStore();
    const [goalInput, setGoalInput] = useState(dailyGoal?.questionsPerDay || 5);
    const [isEditing, setIsEditing] = useState(false);
    const [logDraft, setLogDraft] = useState('');
    const [nicknameInput, setNicknameInput] = useState(profile.nickname);
    const [avatarInput, setAvatarInput] = useState(profile.avatarUrl);
    const isSuperAdmin = authUser?.username === '1561473324';

    useEffect(() => {
        setNicknameInput(profile.nickname);
        setAvatarInput(profile.avatarUrl);
    }, [profile]);

    useEffect(() => {
        const loadRemoteProfile = async () => {
            if (!isSuperAdmin || !authUser?.username) return;
            const remote = await fetchUserProfile(authUser.username);
            if (remote) {
                setProfile({ nickname: remote.nickname, avatarUrl: remote.avatarUrl });
            }
        };
        loadRemoteProfile();
    }, [authUser?.username, isSuperAdmin, setProfile]);

    const totalQuestions = questionBank.length;
    const progress = Math.round((completedQuestions.length / totalQuestions) * 100);

    // Calculate streaks (simple version)
    const currentStreak = dailyCheckins.length > 0 ? 1 : 0; // Placeholder logic

    const handleSaveGoal = () => {
        setDailyGoal({ ...dailyGoal, questionsPerDay: goalInput });
        setIsEditing(false);
    };

    const handleAddLog = () => {
        const content = logDraft.trim();
        if (!content) return;
        addUserLog(content);
        setLogDraft('');
    };

    const practiceTotal = Object.values(practiceCounts).reduce((sum, count) => sum + count, 0);
    const favoriteCount = favorites.length;
    const wrongCount = wrongQuestions.length;

    const handleSaveProfile = async () => {
        const nextProfile = {
            nickname: nicknameInput.trim() || profile.nickname,
            avatarUrl: avatarInput.trim(),
        };
        setProfile(nextProfile);
        if (isSuperAdmin && authUser?.username) {
            await upsertUserProfile(authUser.username, nextProfile.nickname, nextProfile.avatarUrl);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[var(--color-text-main)]">个人中心</h1>
                <div className="text-sm text-[var(--color-text-secondary)]">
                    坚持学习，每天进步一点点
                </div>
            </div>

            <div className="surface-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[var(--color-text-main)]">个人资料</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">设置昵称与头像，展示在侧边栏</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {avatarInput ? (
                        <img src={avatarInput} alt={nicknameInput} className="w-16 h-16 rounded-full object-cover border border-[var(--color-border)]" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold">
                            {(nicknameInput || authUser?.name || 'U').slice(0, 1).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-[var(--color-text-secondary)]">昵称</label>
                            <input
                                value={nicknameInput}
                                onChange={(e) => setNicknameInput(e.target.value)}
                                placeholder="展示名称"
                                className="px-3 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-[var(--color-text-secondary)]">头像链接 (可选)</label>
                            <input
                                value={avatarInput}
                                onChange={(e) => setAvatarInput(e.target.value)}
                                placeholder="https://..."
                                className="px-3 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                            />
                        </div>
                    </div>
                    <button onClick={handleSaveProfile} className="btn-primary px-4 py-3 rounded-xl whitespace-nowrap">保存资料</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="surface-card p-6 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow neon-card">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                        <Trophy className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-text-main)]">{completedQuestions.length}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">已刷题目</div>
                </div>

                <div className="surface-card p-6 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow neon-card">
                    <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-2">
                        <Target className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-text-main)]">{progress}%</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">题库完成率</div>
                </div>

                <div className="surface-card p-6 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow neon-card">
                    <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-2">
                        <Calendar className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-text-main)]">{dailyCheckins.length}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">打卡天数</div>
                </div>

                <div className="surface-card p-6 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow neon-card">
                    <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-2">
                        <Zap className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-text-main)]">{currentStreak}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">当前连胜</div>
                </div>
            </div>

            {/* Daily Goal Setting */}
            <div className="surface-card p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)]">每日目标</h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">设定每天想要完成的题目数量</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium text-sm"
                        >
                            修改目标
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveGoal}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                            >
                                保存
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 bg-[var(--color-hover)] text-[var(--color-text-secondary)] rounded-md text-sm hover:bg-[var(--color-border)]"
                            >
                                取消
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={goalInput}
                                onChange={(e) => setGoalInput(Number(e.target.value))}
                                className="w-20 p-2 border border-[var(--color-border)] rounded-md text-center font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-[var(--color-bg)] text-[var(--color-text-main)]"
                            />
                            <span className="text-[var(--color-text-secondary)]">题 / 天</span>
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{dailyGoal?.questionsPerDay || 5}</span>
                            <span className="text-[var(--color-text-secondary)]">题 / 天</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Calendar */}
            <div className="surface-card p-8">
                <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-6">活跃记录</h2>
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 60 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (59 - i));
                        const dateStr = date.toISOString().split('T')[0];
                        const isActive = dailyCheckins.includes(dateStr);

                        return (
                            <div
                                key={i}
                                title={dateStr}
                                className={`w-3 h-3 rounded-sm transition-colors ${isActive ? 'bg-green-500' : 'bg-[var(--color-hover)]'}`}
                            />
                        );
                    })}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-[var(--color-text-secondary)]">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-[var(--color-hover)] rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span>More</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="surface-card p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)]">进度统计面板</h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">追踪刷题强度与成长轨迹</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                <Layers className="w-4 h-4" />
                                刷题次数
                            </div>
                            <span className="text-sm font-semibold text-[var(--color-text-main)]">{practiceTotal}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${Math.min(100, (practiceTotal / 200) * 100)}%` }} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                <Star className="w-4 h-4" />
                                收藏数量
                            </div>
                            <span className="text-sm font-semibold text-[var(--color-text-main)]">{favoriteCount}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${Math.min(100, (favoriteCount / 50) * 100)}%` }} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                <Flame className="w-4 h-4" />
                                错题储备
                            </div>
                            <span className="text-sm font-semibold text-[var(--color-text-main)]">{wrongCount}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 to-pink-500" style={{ width: `${Math.min(100, (wrongCount / 50) * 100)}%` }} />
                        </div>
                    </div>
                </div>

                <div className="surface-card p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <NotebookPen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)]">学习日志</h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">记录每天的复盘</p>
                        </div>
                    </div>
                    <textarea
                        value={logDraft}
                        onChange={(e) => setLogDraft(e.target.value)}
                        placeholder="写一段学习日志..."
                        className="w-full min-h-[120px] p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                    />
                    <button onClick={handleAddLog} className="btn-primary px-4 py-2 rounded-lg w-fit">添加日志</button>

                    <div className="flex flex-col gap-3">
                        {userLogs.length === 0 ? (
                            <div className="text-sm text-[var(--color-text-secondary)]">暂无日志</div>
                        ) : (
                            userLogs.map(log => (
                                <div key={log.id} className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/40">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-[var(--color-text-secondary)]">{new Date(log.createdAt).toLocaleString()}</span>
                                        <button
                                            onClick={() => removeUserLog(log.id)}
                                            className="text-[var(--color-text-secondary)] hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-[var(--color-text-main)] whitespace-pre-wrap">{log.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
