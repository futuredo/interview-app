import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = '确认',
    cancelText = '取消',
    onConfirm,
    onCancel,
    variant = 'info',
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        info: 'bg-blue-500 hover:bg-blue-600 text-white',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onCancel}
        >
            {/* 遮罩 */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* 弹窗 */}
            <div
                className="relative bg-[var(--color-surface)] rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 关闭按钮 */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--color-hover)] text-[var(--color-text-secondary)] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* 标题 */}
                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-3 pr-8">
                    {title}
                </h3>

                {/* 内容 */}
                <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                    {message}
                </p>

                {/* 按钮组 */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)] text-[var(--color-text-main)] transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg transition-colors ${variantStyles[variant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
