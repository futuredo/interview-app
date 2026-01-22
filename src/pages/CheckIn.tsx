import React, { useState } from 'react';
import { CalendarCheck, Clock, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CheckIn: React.FC = () => {
    const { addCheckInRecord, checkInRecords, checkInTime, setCheckInTime } = useStore();
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const [time, setTime] = useState(checkInTime || '21:00');

    const handleCheckIn = () => {
        if (!date || !time) return;
        addCheckInRecord({ date, time });
    };

    const sortedRecords = [...checkInRecords].sort((a, b) => {
        if (a.date === b.date) return a.time.localeCompare(b.time);
        return b.date.localeCompare(a.date);
    });

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <CalendarCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-main)]">打卡中心</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">选择时间完成今日打卡</p>
                </div>
            </div>

            <div className="surface-card p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-[var(--color-text-secondary)]">选择日期</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-[var(--color-text-secondary)]">选择时间</label>
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                            />
                            <button
                                onClick={() => setCheckInTime(time)}
                                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                            >
                                设为默认
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCheckIn}
                    className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 w-fit"
                >
                    <CheckCircle className="w-5 h-5" />
                    完成打卡
                </button>
            </div>

            <div className="surface-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">打卡记录</span>
                </div>
                {sortedRecords.length === 0 ? (
                    <div className="text-sm text-[var(--color-text-secondary)]">暂无打卡记录</div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {sortedRecords.map((record, index) => (
                            <div key={`${record.date}-${record.time}-${index}`} className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--color-border)]">
                                <span className="text-[var(--color-text-main)]">{record.date}</span>
                                <span className="text-[var(--color-text-secondary)]">{record.time}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
