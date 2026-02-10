import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { hotwordPages } from '../data/hotwords';

export const HotwordHub: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="热词可视化"
                subtitle="收集游戏开发常见词汇，用小工具帮助理解。"
                kicker="Hotwords"
                icon={<BookOpen className="w-6 h-6" />}
                meta={<span>共 {hotwordPages.length} 个主题</span>}
            />

            <div className="grid gap-4 md:grid-cols-2">
                {hotwordPages.map((page) => (
                    <Link
                        key={page.id}
                        to={page.path}
                        className="surface-card p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-[var(--color-text-main)]">{page.title}</h2>
                            <span className="text-xs rounded-full bg-[var(--color-bg)] px-3 py-1 text-[var(--color-text-secondary)]">
                                {page.tag}
                            </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">{page.description}</p>
                        <span className="text-xs text-[var(--color-primary)] font-semibold">点击进入</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
