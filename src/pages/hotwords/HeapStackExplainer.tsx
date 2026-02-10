import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, Box, ArrowLeft } from 'lucide-react';

interface AllocItem {
    id: number;
    name: string;
    size: number; // visual height
}

const HeapStackExplainer: React.FC = () => {
  const [stack, setStack] = useState<AllocItem[]>([]);
  const [heap, setHeap] = useState<AllocItem[]>([]);
  
  const funcNames = ['main()', 'Update()', 'CalcPhysics()', 'OnCollision()'];
  const objNames = ['Player', 'Enemy', 'Texture', 'Mesh', 'AudioClip'];

  // Stack Operations
  const pushStack = () => {
    if (stack.length >= 6) return;
    const name = funcNames[stack.length % funcNames.length];
    setStack(prev => [...prev, { id: Date.now(), name, size: 40 }]);
  };

  const popStack = () => {
    if (stack.length === 0) return;
    setStack(prev => prev.slice(0, -1));
  };

  // Heap Operations
  const allocHeap = () => {
    if (heap.length >= 10) return;
    const name = objNames[Math.floor(Math.random() * objNames.length)];
    const size = 40 + Math.random() * 40; // Variable size
    setHeap(prev => [...prev, { id: Date.now(), name, size }]);
  };

  const deallocHeap = (id: number) => {
    setHeap(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 mt-8">
      <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        返回热词列表
      </Link>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Stack (栈) vs Heap (堆)</h2>
        <p className="text-slate-600 mb-8">
          内存管理的两个核心区域。
          <br/>
          <span className="text-sm text-slate-500">
            Stack: 类似叠盘子，LIFO，速度极快，用于函数调用和局部变量。<br/>
            Heap: 自由存储区，随意分配/释放，用于长期存在的对象，需手动管理或GC。
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* STACK SECTION */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                        <Layers className="text-blue-500" /> Stack 栈
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={pushStack} disabled={stack.length>=6} className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition">入栈 (Push)</button>
                        <button onClick={popStack} disabled={stack.length===0} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition">出栈 (Pop)</button>
                    </div>
                </div>
                
                {/* Visual Stack Container (Bottom Up) */}
                <div className="h-[350px] bg-white border-x-2 border-b-2 border-slate-300 rounded-b-lg relative flex flex-col-reverse justify-start p-2 gap-1 overflow-hidden">
                    <AnimatePresence>
                        {stack.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ y: -50, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                className="w-full bg-blue-500 text-white rounded p-3 text-center shadow-md border-b-4 border-blue-700 shrink-0"
                                style={{
                                    zIndex: index
                                }}
                            >
                                <span className="font-mono text-sm">{item.name}</span>
                                <div className="text-[10px] opacity-70">Stack Frame #{index+1}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {stack.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                            栈为空 (Empty)
                        </div>
                    )}
                </div>
                <p className="mt-2 text-xs text-slate-500 text-center">
                    LIFO (Last In, First Out). 严格有序。
                </p>
            </div>

            {/* HEAP SECTION */}
             <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                        <Box className="text-emerald-500" /> Heap 堆
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={allocHeap} disabled={heap.length>=10} className="text-xs bg-emerald-100 text-emerald-600 px-3 py-1 rounded hover:bg-emerald-200 transition">分配 (New)</button>
                    </div>
                </div>
                
                {/* Visual Heap Container (Free Floating) */}
                <div className="h-[350px] bg-white border border-slate-300 border-dashed rounded-lg relative p-2 overflow-hidden">
                    <AnimatePresence>
                        {heap.map((item, i) => {
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute bg-emerald-100 border border-emerald-300 text-emerald-800 rounded shadow-sm hover:bg-red-100 hover:border-red-300 hover:text-red-600 cursor-pointer flex flex-col items-center justify-center transition-colors"
                                    style={{
                                        width: '80px',
                                        height: item.size + 'px',
                                        left: `${(i % 3) * 33}%`, // Simple grid-ish layout but varied
                                        top: `${Math.floor(i / 3) * 25}%`,
                                        margin: '5px'
                                    }}
                                    onClick={() => deallocHeap(item.id)}
                                >
                                    <span className="font-mono text-[10px] font-bold">{item.name}</span>
                                    <span className="text-[9px] opacity-60 text-center leading-tight">0x{item.id.toString(16).slice(-4)}</span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                     {heap.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                            堆为空 (Empty)
                        </div>
                    )}
                </div>
                <p className="mt-2 text-xs text-slate-500 text-center">
                    点击对象以释放内存 (free)。碎片化分布。
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default HeapStackExplainer;
