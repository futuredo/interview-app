import React, { useState } from 'react';
import { RefreshCcw, Trash2, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface PooledObject {
    id: number;
    active: boolean;
    data: string;
}

export const ObjectPoolExplainer: React.FC = () => {
    // Standard approach state
    const [standardList, setStandardList] = useState<{id: number}[]>([]);
    const [standardStats, setStandardStats] = useState({ created: 0, destroyed: 0 });

    // Pool approach state
    const poolSize = 10;
    const [pool, setPool] = useState<PooledObject[]>(
        Array.from({ length: poolSize }, (_, i) => ({ id: i, active: false, data: `Node_${i}` }))
    );
    const [poolStats, setPoolStats] = useState({ activated: 0, deactivated: 0, peak: 0 });

    // --- Standard Methods ---
    const spawnStandard = () => {
        setStandardList(prev => [...prev, { id: Date.now() + Math.random() }]);
        setStandardStats(prev => ({ ...prev, created: prev.created + 1 }));
    };

    const destroyStandard = (id: number) => {
        setStandardList(prev => prev.filter(item => item.id !== id));
        setStandardStats(prev => ({ ...prev, destroyed: prev.destroyed + 1 }));
    };

    // --- Pool Methods ---
    const spawnFromPool = () => {
        const availableIndex = pool.findIndex(p => !p.active);
        if (availableIndex !== -1) {
            const newPool = [...pool];
            newPool[availableIndex].active = true;
            setPool(newPool);
            setPoolStats(prev => ({ ...prev, activated: prev.activated + 1 }));
        } else {
            alert('对象池已耗尽! (实际游戏中可能会扩容池子)');
        }
    };

    const returnToPool = (index: number) => {
        const newPool = [...pool];
        newPool[index].active = false;
        setPool(newPool);
        setPoolStats(prev => ({ ...prev, deactivated: prev.deactivated + 1 }));
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 mt-8">
            <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回热词列表
            </Link>
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                    <RefreshCcw className="text-green-600" />
                    对象池 (Object Pooling)
                </h1>
                <p className="text-gray-600">
                    通过重用对象来避免频繁的内存分配（Alloc）和垃圾回收（GC）。
                    左侧模拟频繁 `new/delete`，右侧模拟 `Get/Return`。
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Standard Approach */}
                <div className="border rounded-xl p-6 bg-red-50">
                    <h3 className="text-xl font-bold text-red-800 flex items-center gap-2 mb-4">
                        <Trash2 /> 传统方式 (Instantiate / Destroy)
                    </h3>
                    <div className="flex gap-4 mb-4 text-sm font-mono bg-white p-2 rounded">
                        <div>内存分配: {standardStats.created}</div>
                        <div>GC回收: {standardStats.destroyed}</div>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <button onClick={spawnStandard} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            生成 (New)
                        </button>
                        <button onClick={() => setStandardList([])} className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">
                            清空 (Clear)
                        </button>
                    </div>
                    <div className="h-64 overflow-y-auto border bg-white p-2 rounded relative">
                        <AnimatePresence>
                            {standardList.map(item => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    onClick={() => destroyStandard(item.id)}
                                    className="inline-block m-1 p-2 bg-red-100 border border-red-300 rounded cursor-pointer hover:bg-red-200"
                                >
                                    对象
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Pool Approach */}
                <div className="border rounded-xl p-6 bg-green-50">
                    <h3 className="text-xl font-bold text-green-800 flex items-center gap-2 mb-4">
                        <Package /> 对象池 (Rent / Return)
                    </h3>
                    <div className="flex gap-4 mb-4 text-sm font-mono bg-white p-2 rounded">
                        <div>激活数: {poolStats.activated}</div>
                        <div>池大小: {poolSize}</div>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <button onClick={spawnFromPool} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            获取 (Get)
                        </button>
                        <button onClick={() => {
                            setPool(pool.map(p => ({...p, active: false})));
                        }} className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50">
                            全部归还 (Return All)
                        </button>
                    </div>
                    
                    <div className="h-64 border bg-gray-900 p-2 rounded relative grid grid-cols-4 gap-2 content-start">
                        {pool.map((obj, idx) => (
                            <motion.div
                                key={obj.id}
                                layout
                                onClick={() => obj.active && returnToPool(idx)}
                                className={`
                                    p-2 rounded text-xs font-mono text-center cursor-pointer border transition-colors
                                    ${obj.active 
                                        ? 'bg-green-500 text-white border-green-400 hover:bg-red-500' // Click to "kill"
                                        : 'bg-gray-800 text-gray-500 border-gray-700'} 
                                `}
                            >
                                {obj.active ? '活跃' : '闲置'}
                                <div className="text-[10px] opacity-50">#{idx}</div>
                            </motion.div>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-green-800">
                        *注意看 ID 并没有变化，说明内存地址没有变动，没有 GC 压力。点击绿色方块回收。
                    </p>
                </div>
            </div>
        </div>
    );
};
