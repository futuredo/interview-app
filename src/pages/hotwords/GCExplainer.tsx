import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, RefreshCw, Database, ArrowLeft } from 'lucide-react';

interface MemoryBlock {
  id: number;
  active: boolean; // Is it referenced?
  marked: boolean; // Has GC marked it?
  content: string;
}

const GCExplainer: React.FC = () => {
  const [memory, setMemory] = useState<MemoryBlock[]>([]);
  const [isGCing, setIsGCing] = useState(false);
  const [gcStage, setGcStage] = useState<'idle' | 'mark' | 'sweep'>('idle');

  // Helpers
  const allocate = () => {
    if (memory.length >= 12) return;
    const newItem: MemoryBlock = {
      id: Date.now(),
      active: true, // Initially referenced
      marked: false,
      content: Math.random().toString(36).substring(7)
    };
    setMemory(prev => [...prev, newItem]);
  };

  const toggleReference = (id: number) => {
    if (isGCing) return;
    setMemory(prev => prev.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
  };

  const runGC = async () => {
    if (isGCing) return;
    setIsGCing(true);

    // Stage 1: Mark
    setGcStage('mark');
    await new Promise(r => setTimeout(r, 1000));
    setMemory(prev => prev.map(item => ({
        ...item,
        marked: item.active // Mark if active (referenced)
    })));

    // Stage 2: Sweep
    await new Promise(r => setTimeout(r, 1000));
    setGcStage('sweep');
    await new Promise(r => setTimeout(r, 800));
    
    // Actually remove unmarked
    setMemory(prev => prev.filter(item => item.marked));
    
    // Reset marks for next cycle
    setMemory(prev => prev.map(item => ({ ...item, marked: false })));
    
    setGcStage('idle');
    setIsGCing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        返回热词列表
      </Link>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">垃圾回收 (Garbage Collection)</h2>
        <p className="text-slate-600 mb-6">
          演示最基本的 "Mark-and-Sweep" (标记-清除) 算法。
          <br/>
          <span className="text-sm text-slate-500">
            1. Mark: 从根节点遍历，标记所有可达对象。 2. Sweep: 清除未被标记的内存。
          </span>
        </p>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
            <button 
                onClick={allocate}
                disabled={isGCing || memory.length >= 12}
                className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                <Database size={18} />
                新建对象 (New)
            </button>
            <button 
                onClick={runGC}
                disabled={isGCing || memory.length === 0}
                className="btn btn-secondary bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 disabled:opacity-50 flex items-center gap-2"
            >
                {isGCing ? <RefreshCw className="animate-spin" size={18} /> : <Trash2 size={18} />}
                执行 GC
            </button>
        </div>

        {/* Status Bar */}
        <div className="mb-4 flex items-center justify-between text-sm">
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>活跃 Active (有引用)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <span>垃圾 Garbage (无引用)</span>
                </div>
            </div>
            <div className={`font-mono font-bold ${
                gcStage === 'mark' ? 'text-blue-600' :
                gcStage === 'sweep' ? 'text-red-600' : 'text-slate-400'
            }`}>
                状态: {gcStage === 'idle' ? 'IDLE' : gcStage.toUpperCase()}
            </div>
        </div>

        {/* Memory Grid */}
        <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl p-6 min-h-[200px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatePresence>
                    {memory.map((block) => (
                        <motion.div
                            key={block.id}
                            layout
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                scale: 1, 
                                opacity: gcStage === 'sweep' && !block.active ? 0.2 : 1,
                                borderColor: gcStage === 'mark' && block.marked ? '#10b981' : (block.active ? '#10b981' : '#cbd5e1'), 
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => toggleReference(block.id)}
                            className={`
                                relative h-24 rounded-lg bg-white border-2 cursor-pointer shadow-sm flex flex-col items-center justify-center transition-all
                                ${block.active ? 'border-emerald-500' : 'border-slate-300 bg-slate-100 text-slate-400'}
                                ${isGCing ? 'cursor-wait pointer-events-none' : 'hover:scale-105'}
                            `}
                        >
                            <Database size={24} className={block.active ? 'text-emerald-500' : 'text-slate-300'} />
                            <span className="font-mono text-xs mt-2">{block.content}</span>
                            
                            {/* Connection Indicator */}
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${block.active ? 'bg-emerald-500' : 'bg-transparent border border-slate-300'}`} />

                            {/* Mark Indicator */}
                            {gcStage === 'mark' && block.marked && (
                                <motion.div 
                                    initial={{ scale: 1.5, opacity: 0 }} 
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute -top-2 -left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full"
                                >
                                    MARKED
                                </motion.div>
                            )}

                             {/* Sweep Indicator */}
                             {gcStage === 'sweep' && !block.marked && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-lg"
                                >
                                    <Trash2 className="text-red-600" size={32} />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {memory.length === 0 && (
                     <div className="col-span-full flex flex-col items-center justify-center h-40 text-slate-400 border border-slate-200 border-dashed rounded-lg bg-slate-50/50">
                        <span className="mb-2">Heap Empty</span>
                        <div className="text-xs">Alloc new objects to begin</div>
                     </div>
                )}
            </div>
        </div>
        
        <p className="mt-4 text-xs text-slate-400 text-center">
            点击对象以断开引用 (模拟失去作用域引用)，然后运行 GC 清除它们。
        </p>

      </div>
    </div>
  );
};

export default GCExplainer;
