import React, { useState } from 'react';
import { Radio, Bell, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const ObserverExplainer: React.FC = () => {
    const [subscribers, setSubscribers] = useState([
        { id: 1, name: 'UI / 血条 (HP)', active: true, color: 'bg-red-100 border-red-500' },
        { id: 2, name: '音效 / SFX', active: true, color: 'bg-blue-100 border-blue-500' },
        { id: 3, name: '成就系统 / System', active: false, color: 'bg-yellow-100 border-yellow-500' },
        { id: 4, name: '日志 / Logs', active: true, color: 'bg-gray-100 border-gray-500' },
    ]);

    const [eventSignal, setEventSignal] = useState<number | null>(null);

    const toggleSub = (id: number) => {
        setSubscribers(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    };

    const emitEvent = () => {
        setEventSignal(Date.now());
        // Auto clear visual after effect
        setTimeout(() => setEventSignal(null), 1000);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-12 mt-8">
            <Link to="/hotwords" className="absolute top-6 left-6 inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回热词列表
            </Link>
             <header className="text-center">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
                    <Radio className="text-pink-600" />
                    观察者模式 (Observer / Event Bus)
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    发布者 (Subject) 不需要知道订阅者 (Observer) 的具体实现。
                    它只管 "广播" 事件，谁订阅了谁就收到通知。解耦神器。
                </p>
            </header>

            <div className="relative h-[400px] bg-slate-50 border rounded-xl flex items-center justify-center">
                
                {/* Connection Lines (Background) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {subscribers.map((sub) => {
                         if (!sub.active) return null;
                         // Assuming center is roughly 50% 50%
                         // This is tricky without absolute pixels, simplifying visual:
                         return null; // Using motion instead
                    })}
                </svg>

                {/* Subject (Center) */}
                <div className="z-20 relative">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={emitEvent}
                        className="w-32 h-32 rounded-full bg-pink-600 text-white flex flex-col items-center justify-center shadow-lg hover:bg-pink-700 transition"
                    >
                        <Bell className={`w-8 h-8 mb-2 ${eventSignal ? 'animate-bounce' : ''}`} />
                        <span className="font-bold">玩家死亡</span>
                        <span className="text-xs opacity-80">(点击触发)</span>
                    </motion.button>
                     {/* Expanding Ring Effect */}
                     <AnimatePresence>
                        {eventSignal && (
                            <motion.div
                                initial={{ width: 100, height: 100, opacity: 0.8 }}
                                animate={{ width: 500, height: 500, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-pink-400 rounded-full z-10 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Observers (Surrounding) */}
                <div className="absolute inset-0 pointer-events-none">
                    {subscribers.map((sub, i) => {
                        // Calculate position in circle
                        const angleDeg = (i * (360 / subscribers.length)) - 45; // rotate starting pos
                        const radius = 180; // pixels from center
                        const angleRad = angleDeg * (Math.PI / 180);
                        const left = `calc(50% + ${Math.cos(angleRad) * radius}px)`;
                        const top = `calc(50% + ${Math.sin(angleRad) * radius}px)`;

                        return (
                            <motion.div
                                key={sub.id}
                                animate={eventSignal && sub.active ? { 
                                    scale: [1, 1.2, 1],
                                    // rotate: [0, 10, -10, 0] 
                                } : {}}
                                style={{ left, top }}
                                className={`
                                    absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto
                                    w-40 p-3 rounded-lg border-2 shadow-sm cursor-pointer transition-all duration-300
                                    ${sub.active ? sub.color : 'bg-gray-200 border-gray-300 opacity-50 grayscale'}
                                `}
                                onClick={() => toggleSub(sub.id)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-bold text-sm">{sub.name}</div>
                                    <div className={`w-2 h-2 rounded-full ${sub.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </div>
                                <div className="text-xs">
                                    {sub.active ? (eventSignal ? '接收事件!' : '监听中...') : '未订阅'}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                <strong>说明：</strong> 点击 <span className="text-pink-600 font-bold">中间红色按钮</span> 模拟发出事件。
                点击 <span className="text-gray-600 font-bold">周围的方块</span> 可以订阅/取消订阅（Toggle Subscribe）。
                只有 Active 的观察者才会响应事件，且它们之间互不影响。
            </div>
        </div>
    );
};
