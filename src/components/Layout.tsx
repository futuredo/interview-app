import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, CheckSquare, Home, User, Sun, Moon, Trophy, Star, Menu, X, CalendarCheck, LogIn, LogOut, Shield, Activity } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../store/useStore';

export const Layout: React.FC = () => {
    const location = useLocation();
    const { theme, toggleTheme, authUser, logout, profile } = useStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const navItems = [
        { icon: Home, label: '首页', path: '/' },
        { icon: Trophy, label: '闯关挑战', path: '/challenge' },
        { icon: BookOpen, label: '全部题库', path: '/questions' },
        { icon: Star, label: '收藏夹', path: '/favorites' },
        { icon: CheckSquare, label: '错题本', path: '/wrong' },
        { icon: CalendarCheck, label: '打卡', path: '/checkin' },
        { icon: Activity, label: '数据统计', path: '/stats' },
        { icon: User, label: '个人中心', path: '/profile' },
        ...(authUser?.role === 'admin' ? [{ icon: Shield, label: '管理员', path: '/admin' }] : []),
    ];

    return (
        <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text-main)] transition-colors duration-300">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--color-surface)] shadow-md md:hidden border border-[var(--color-border)]"
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "sidebar-shell fixed top-0 left-0 h-full w-64 border-r border-[var(--color-border)] z-50 transition-transform duration-300 ease-in-out flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 border-b border-[var(--color-border)] flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <CheckSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Unity 面试宝典</h1>
                        <p className="text-xs text-[var(--color-text-secondary)]">助你拿下 Offer</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={clsx(
                                    'sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                                    isActive
                                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/30'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-main)]'
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive && "fill-current opacity-20")} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[var(--color-border)]">
                    {authUser ? (
                        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-text-secondary)]">
                            <div className="flex items-center gap-3">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt={profile.nickname} className="w-10 h-10 rounded-full object-cover border border-[var(--color-border)]" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold">
                                        {(profile.nickname || authUser.name).slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap leading-tight">
                                        <span className="font-semibold text-base text-[var(--color-text-main)]">{profile.nickname || authUser.name}</span>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${authUser.role === 'admin' ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}>
                                            {authUser.role === 'admin' ? '管理员' : '普通用户'}
                                        </span>
                                    </div>
                                    {authUser.username && (
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">账号：{authUser.username}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="btn-ghost justify-start gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                退出登录
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsSidebarOpen(false)}
                            className="btn-secondary w-full justify-center mb-4 gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            登录
                        </Link>
                    )}
                    <button
                        onClick={toggleTheme}
                        className="btn-ghost w-full justify-center gap-3"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="font-medium">{theme === 'dark' ? '切换亮色' : '切换深色'}</span>
                    </button>

                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center">
                        <p className="text-xs text-[var(--color-text-secondary)] font-medium">作者：叁伍味</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 opacity-70">wx：Szh24-8</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                <div className="page-shell flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full pt-20 md:pt-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
