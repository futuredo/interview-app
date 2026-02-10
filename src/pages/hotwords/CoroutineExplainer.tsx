import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoroutineExplainer: React.FC = () => {
  const [executionLog, setExecutionLog] = useState<{frame: number, msg: string}[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Simulation state
  const [progress, setProgress] = useState(0);
  const [isYielded, setIsYielded] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame(f => f + 1);
        
        // Simulating the Game Loop
        // 1. Regular Update
        // 2. Coroutine Processing

        // Logic for our specific coroutine:
        // yield return new WaitForSeconds(3) (simulated as 3 frames here for speed)
        
        if (progress < 100 && !isYielded) {
             // Doing work
             setProgress(p => Math.min(100, p + 20));
             setExecutionLog(prev => [...prev.slice(-4), { frame: currentFrame, msg: 'Coroutine: Working...' }]);
             
             if (progress + 20 >= 50 && progress < 50) {
                 // Simulate hitting a yield 
                 setIsYielded(true);
                 setExecutionLog(prev => [...prev.slice(-4), { frame: currentFrame, msg: 'yield return WaitForSeconds(3)' }]);
                 setTimeout(() => {
                     setIsYielded(false);
                 }, 1500); // 1.5s real time pause
             }
        } else if (isYielded) {
            setExecutionLog(prev => [...prev.slice(-4), { frame: currentFrame, msg: 'Coroutine: Suspended (Waiting)' }]);
        }

      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentFrame, progress, isYielded]);

  const reset = () => {
      setIsPlaying(false);
      setCurrentFrame(0);
      setProgress(0);
      setIsYielded(false);
      setExecutionLog([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/hotwords" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <ArrowLeft size={24} />
        </Link>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">协程 (Coroutine)</h2>
            <p className="text-slate-500 text-sm">分步执行：在多帧之间分散逻辑，而非阻塞线程。</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
        {/* Timeline Visualization */}
        <div className="relative h-32 bg-slate-50 border-b border-slate-200 mb-6 overflow-hidden flex items-center px-4">
             <div className="absolute top-2 left-2 text-xs font-mono text-slate-400">游戏主循环时间轴 (GAME LOOP)</div>
             
             {/* Frame Markers */}
             <div className="flex gap-2 w-full overflow-hidden">
                <motion.div 
                    className="flex gap-2"
                    animate={{ x: -currentFrame * 40 }}
                    transition={{ type: 'tween', ease: 'linear' }}
                >
                    {Array.from({ length: Math.max(20, currentFrame + 10) }).map((_, i) => (
                        <div key={i} className={`w-8 h-16 shrink-0 flex items-center justify-center rounded text-xs font-mono border ${i === currentFrame ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-300'}`}>
                            {i}
                        </div>
                    ))}
                </motion.div>
             </div>

             {/* Playhead */}
             <div className="absolute left-[4rem] top-0 bottom-0 w-0.5 bg-red-500 z-10 opactiy-50"></div>
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Logic Execution */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Clock size={16} /> 协程执行状态
                </h3>
                
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                        className={`h-full ${isYielded ? 'bg-yellow-400' : 'bg-green-500'}`}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                    <span>开始</span>
                    <span className="font-bold">{isYielded ? '挂起 (SUSPENDED)' : (progress >= 100 ? '完成 (COMPLETED)' : '运行中 (RUNNING)')}</span>
                    <span>结束</span>
                </div>

                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm h-40 overflow-y-auto">
                    {executionLog.map((log, i) => (
                        <div key={i} className="mb-1 opacity-80">
                            <span className="text-slate-500 mr-2">[{log.frame.toString().padStart(3, '0')}]</span>
                            {log.msg}
                        </div>
                    ))}
                    {executionLog.length === 0 && <span className="text-slate-600">// 协程空闲中...</span>}
                </div>
            </div>

            {/* Controls & Explanation */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-slate-700 mb-2">原理说明</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        协程不是多线程。它是在主线程上运行的函数，能够能够暂停执行(<code className="bg-slate-200 px-1 rounded">yield</code>)并将控制权交还给Unity，在下一帧或指定时间后继续执行。
                    </p>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${isPlaying ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {isPlaying ? <><Pause size={16} /> 暂停</> : <><Play size={16} /> 启动协程</>}
                    </button>
                    <button 
                         onClick={reset}
                         className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                    >
                        <RotateCcwIcon />
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

// Helper for icon
const RotateCcwIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/></svg>
);

export default CoroutineExplainer;
