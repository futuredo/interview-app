import React, { useState } from 'react';
import { GitCommit, Footprints, Zap, Coffee, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type State = 'Idle' | 'Patrol' | 'Chase' | 'Attack';

export const FSMExplainer: React.FC = () => {
    const [currentState, setCurrentState] = useState<State>('Idle');
    const [log, setLog] = useState<string[]>(['System initialized.']);
    
    // Simulate game variables
    const [distToPlayer, setDistToPlayer] = useState(20);

    const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 10));

    const transition = (newState: State, reason: string) => {
        if (currentState === newState) return;
        addLog(`State changed: ${currentState} -> ${newState} (${reason})`);
        setCurrentState(newState);
    };

    // Logic Tick simulating Update()
    const tick = () => {
        switch (currentState) {
            case 'Idle':
                if (distToPlayer < 15) transition('Chase', 'Player spotted');
                else if (Math.random() > 0.7) transition('Patrol', 'Bored');
                else addLog('Idle: Zzz...');
                break;
            case 'Patrol':
                if (distToPlayer < 15) transition('Chase', 'Player spotted while patrolling');
                else if (Math.random() > 0.8) transition('Idle', 'Stop patrolling');
                else addLog('Patrol: Walking points...');
                break;
            case 'Chase':
                if (distToPlayer < 2) transition('Attack', 'In range');
                else if (distToPlayer > 20) transition('Idle', 'Lost player');
                else addLog('Chase: Running to player!');
                break;
            case 'Attack':
                if (distToPlayer > 3) transition('Chase', 'Player moved away');
                else addLog('Attack: SWORD SLASH!');
                break;
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 mt-8">
            <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回热词列表
            </Link>
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                    <GitCommit className="text-indigo-600" />
                    有限状态机 (FSM)
                </h1>
                <p className="text-gray-600">
                    最经典的游戏 AI 控制方式。角色在某一个时刻只能处于一个状态。
                    状态切换通常由<b>Transition 条件</b>触发。
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* Visualizer */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm relative h-80 flex items-center justify-center bg-dots-pattern">
                        <motion.div
                            animate={currentState}
                            variants={{
                                Idle: { scale: 1, backgroundColor: '#e5e7eb' },
                                Patrol: { x: [0, 50, 0, -50, 0], backgroundColor: '#93c5fd', transition: { repeat: Infinity, duration: 4 } },
                                Chase: { scale: 1.1, backgroundColor: '#fca5a5' },
                                Attack: { rotate: [0, -10, 10, 0], backgroundColor: '#ef4444', transition: { repeat: Infinity, duration: 0.5 } },
                            }}
                            className="w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 border-gray-800 shadow-xl z-10"
                        >
                            <div className="text-4xl mb-2">
                                {currentState === 'Idle' && <Coffee />}
                                {currentState === 'Patrol' && <Footprints />}
                                {currentState === 'Chase' && <Zap />}
                                {currentState === 'Attack' && '⚔️'}
                            </div>
                            <div className="font-bold text-lg text-gray-800">{currentState}</div>
                        </motion.div>

                        {/* Connection Lines (Fake Visuals) */}
                        <div className="absolute top-4 left-4 text-xs text-gray-400">NPC Visualizer</div>
                    </div>

                    {/* Controls */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-bold mb-3 flex items-center gap-2">环境变量 (Environment Variables)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    与玩家距离: {distToPlayer}m
                                </label>
                                <input 
                                    type="range" min="0" max="30" value={distToPlayer} 
                                    aria-label="与玩家距离"
                                    onChange={e => setDistToPlayer(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>0m (近战)</span>
                                    <span>30m (远)</span>
                                </div>
                            </div>
                            <button 
                                onClick={tick}
                                className="w-full py-3 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 active:scale-95 transition-transform"
                            >
                                运行逻辑帧 (Update)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                     <h3 className="font-bold text-lg">逻辑追踪 (Logic Trace)</h3>
                     <div className="bg-black text-green-400 font-mono p-4 rounded h-[500px] overflow-y-auto">
                        {log.map((l, i) => (
                            <div key={i} className="mb-1 border-b border-gray-800 pb-1">
                                <span className="opacity-50 mr-2">[{10-i}]</span>
                                {l}
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};
