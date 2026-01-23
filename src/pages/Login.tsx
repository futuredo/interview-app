import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, KeyRound, Lock, Sparkles, CheckCircle2, Crown, Activity, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fetchUserProfile } from '../utils/supabaseApi';

const demoAccounts = [
    { username: 'admin_root', password: 'Admin#2024', name: '系统管理员', role: 'admin' as const },
    { username: 'admin_ops', password: 'Admin#7788', name: '题库审核官', role: 'admin' as const },
    { username: 'player_alpha', password: 'User#1357', name: 'Unity 进阶学员', role: 'user' as const },
    { username: 'player_beta', password: 'User#2468', name: '渲染图形生', role: 'user' as const },
];

const superAdminCredential = {
    username: '1561473324',
    password: '1561473324',
    name: '超级管理员',
    role: 'admin' as const,
};

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, authUser, profile, setProfile } = useStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const fromPath = useMemo(() => (location.state as { from?: string })?.from || '/', [location.state]);

    useEffect(() => {
        if (authUser) {
            navigate(fromPath, { replace: true });
        }
    }, [authUser, fromPath, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedUser = username.trim();
        if (trimmedUser === superAdminCredential.username && password === superAdminCredential.password) {
            login(superAdminCredential.name, superAdminCredential.role, superAdminCredential.username);
            const remoteProfile = await fetchUserProfile(superAdminCredential.username);
            if (remoteProfile) {
                setProfile({ nickname: remoteProfile.nickname, avatarUrl: remoteProfile.avatarUrl });
            } else {
                setProfile({ ...profile, nickname: superAdminCredential.name });
            }
            setError('');
            navigate(fromPath || '/', { replace: true });
            return;
        }
        const matched = demoAccounts.find(
            (account) => account.username === trimmedUser && account.password === password
        );

        if (!matched) {
            setError('账号或密码不正确，请核对后重试');
            return;
        }

        login(matched.name, matched.role, matched.username);
        setProfile({ ...profile, nickname: matched.name });
        setError('');
        navigate(fromPath || '/', { replace: true });
    };

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        if (error) setError('');
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (error) setError('');
    };

    const fillAccount = (account: typeof demoAccounts[number]) => {
        setUsername(account.username);
        setPassword(account.password);
        setError('');
    };

    return (
        <div className="min-h-[calc(100vh-2rem)] relative isolate overflow-hidden">
            <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.16),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.14),transparent_34%)]" aria-hidden />

            <div className="max-w-6xl mx-auto px-4 py-10 relative z-10">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-white shadow-sm shadow-cyan-200/40 border border-white/60">
                            <ShieldCheck className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-cyan-600 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Unity 面试宝典 · 登录
                            </p>
                            <h1 className="text-3xl font-bold text-[var(--color-text-main)] leading-tight mt-1">解锁高频题库与智能练习</h1>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-1">同步收藏、错题与挑战进度，管理员可实时覆盖答案与题库。</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 text-xs rounded-full bg-white/70 border border-[var(--color-border)] shadow-sm text-[var(--color-text-secondary)]">加密传输 · 云端同步</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-start">
                    <div className="surface-card p-8 lg:p-10 flex flex-col gap-7 bg-white/90 backdrop-blur-md border border-white/70 shadow-2xl shadow-cyan-200/40">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-800 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> 300+ 高频真题
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-2">
                                <Crown className="w-4 h-4" /> 管理员可改题
                            </div>
                            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> 练习进度同步
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-[var(--color-surface)]/90 border border-[var(--color-border)] rounded-2xl p-6 shadow-lg shadow-sky-100">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide flex items-center gap-2 uppercase">
                                    <KeyRound className="w-4 h-4" />
                                    账号
                                </label>
                                <input
                                    value={username}
                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                    placeholder="例如 admin_root / admin_ops / player_alpha"
                                    className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-cyan-200 outline-none text-[var(--color-text-main)]"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide flex items-center gap-2 uppercase">
                                    <Lock className="w-4 h-4" />
                                    密码
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    placeholder="请输入对应密码"
                                    className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-cyan-200 outline-none text-[var(--color-text-main)]"
                                />
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <button
                                type="submit"
                                className="btn-primary w-full justify-center text-base py-3 shadow-lg shadow-cyan-200/50"
                                disabled={!username.trim() || !password}
                            >
                                进入系统
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>

                            <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-500" /> 登录后自动同步收藏、错题、挑战记录
                            </div>
                        </form>
                    </div>

                    <div className="surface-card p-8 lg:p-10 flex flex-col gap-6 bg-white/85 backdrop-blur-md border border-white/70 shadow-2xl shadow-emerald-100/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--color-text-main)]">快捷体验不同角色</h2>
                                <p className="text-sm text-[var(--color-text-secondary)]">一键填充账号与密码，直接进入</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-xs text-emerald-700 border border-emerald-100">免注册</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {demoAccounts.map((account) => (
                                <button
                                    type="button"
                                    key={account.username}
                                    onClick={() => fillAccount(account)}
                                    className="w-full text-left border border-[var(--color-border)] rounded-2xl p-4 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100 transition-all bg-white"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-[var(--color-text-main)]">{account.name}</span>
                                            <span className="text-xs text-[var(--color-text-secondary)] mt-0.5">账号：{account.username}</span>
                                        </div>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${account.role === 'admin'
                                            ? 'bg-orange-50 text-orange-600 border-orange-100'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        }`}>
                                            {account.role === 'admin' ? '管理员' : '普通用户'}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-[var(--color-text-secondary)] flex items-center gap-3">
                                        <span>密码：{account.password}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]">一键填充</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed border border-dashed border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-bg)]/70">
                            <p className="font-semibold text-[var(--color-text-main)] mb-1">说明</p>
                            <p>管理员可管理题库、覆盖答案；普通用户可练习、收藏与记录错题。留言与升级日志支持云端同步。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
