import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    kicker?: string;
    meta?: React.ReactNode;
    actions?: React.ReactNode;
    icon?: React.ReactNode;
    align?: 'left' | 'center';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    kicker,
    meta,
    actions,
    icon,
    align = 'left',
}) => {
    return (
        <header className={`page-header ${align === 'center' ? 'page-header--center' : ''}`}>
            <div className="page-header__intro">
                {icon && <div className="page-header__icon">{icon}</div>}
                <div className="page-header__text">
                    {kicker && <div className="page-header__kicker">{kicker}</div>}
                    <h1 className="page-header__title">{title}</h1>
                    {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
                </div>
            </div>
            <div className="page-header__aside">
                {meta && <div className="page-header__meta">{meta}</div>}
                {actions && <div className="page-header__actions">{actions}</div>}
            </div>
        </header>
    );
};
