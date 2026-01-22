import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface CountdownTimerProps {
    totalSeconds: number; // 0 表示无限制
    onTimeUp: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ totalSeconds, onTimeUp }) => {
    const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);

    useEffect(() => {
        setRemainingSeconds(totalSeconds);
    }, [totalSeconds]);

    useEffect(() => {
        if (totalSeconds === 0) return; // 无限制模式

        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [totalSeconds, onTimeUp]);

    // 无限制模式不显示倒计时
    if (totalSeconds === 0) return null;

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const isWarning = remainingSeconds <= 30;

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${isWarning
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400 animate-pulse'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
            }`}>
            {isWarning ? (
                <AlertCircle className="w-5 h-5" />
            ) : (
                <Clock className="w-5 h-5" />
            )}
            <span className="font-mono text-lg font-bold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
};
