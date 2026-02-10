import React, { useState } from 'react';
import { Lock, Globe, Server, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SingletonExplainer: React.FC = () => {
    // Shared State (The "Singleton" Data)
    const [instanceData, setInstanceData] = useState({
        config: '默认配置',
        volume: 100,
        requestCount: 0
    });

    const accessSingleton = (_source: string, action: 'read' | 'write') => {
        if (action === 'write') {
            setInstanceData(prev => ({
                ...prev,
                requestCount: prev.requestCount + 1,
                volume: Math.max(0, Math.min(100, prev.volume + (Math.random() > 0.5 ? 10 : -10)))
            }));
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-12 mt-8">
            <Link to="/hotwords" className="absolute top-6 left-6 inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回热词列表
            </Link>
            <header className="text-center">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
                    <Lock className="text-yellow-600" />
                    单例模式 (Singleton)
                </h1>
                <p className="text-gray-600">
                    保证一个类仅有一个实例，并提供一个访问它的全局访问点。
                </p>
            </header>

            <div className="relative h-[400px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center">
                
                {/* The Singleton Instance */}
                <motion.div 
                    key={instanceData.requestCount}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    className="z-10 bg-yellow-100 border-4 border-yellow-500 rounded-2xl p-6 w-64 shadow-2xl flex flex-col items-center"
                >
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 -mt-10 tracking-widest">
                        INSTANCE (0x0F2A)
                    </div>
                    
                    <Globe className="w-12 h-12 text-yellow-700 mb-2" />
                    <h3 className="font-bold text-lg mb-4">GameManager</h3>
                    
                    <div className="w-full space-y-2 text-sm font-mono bg-white p-3 rounded border">
                        <div className="flex justify-between">
                            <span>Vol:</span>
                            <span className="font-bold text-blue-600">{instanceData.volume}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Reqs:</span>
                            <span className="font-bold text-red-600">{instanceData.requestCount}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Clients accessing it */}
                <ClientNode 
                    name="UI 系统" 
                    icon={<User />} 
                    pos="top-10 left-10" 
                    color="bg-blue-500"
                    onAccess={() => accessSingleton('UI', 'write')}
                />
                 <ClientNode 
                    name="音频系统" 
                    icon={<Server />} 
                    pos="top-10 right-10" 
                    color="bg-purple-500"
                    onAccess={() => accessSingleton('Audio', 'write')}

                />
                 <ClientNode 
                    name="网络模块" 
                    icon={<Globe />} 
                    pos="bottom-10 left-1/2 -translate-x-1/2" 
                    color="bg-green-500"
                    onAccess={() => accessSingleton('Net', 'write')}
                />

            </div>

            <div className="bg-red-50 p-4 rounded text-sm text-red-800 border border-red-100">
                <strong>Warning:</strong> 单例虽然方便，但也是“全局变量”。在大项目中，它会导致代码耦合度过高（所有人都依赖它），且不仅难于测试，多线程下还需加锁 (Lock) 保证线程安全。
            </div>
        </div>
    );
};

const ClientNode = ({ name, icon, pos, color, onAccess }: any) => (
    <div className={`absolute ${pos} flex flex-col items-center`}>
        <button 
            onClick={onAccess}
            className={`${color} text-white p-3 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all mb-2 z-20 relative`}
        >
            {React.cloneElement(icon, { size: 20 })}
        </button>
        <span className="font-bold text-xs bg-white px-2 py-1 rounded border shadow-sm z-20 relative">{name}</span>
        {/* Fake wire */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-[1px] border-dashed border-gray-400 z-0 origin-top-left" 
            style={{ 
                width: '100px', // simplified, ideally calculated
                transform: 'rotate(45deg)' // simplified
            }} 
        />
    </div>
);
