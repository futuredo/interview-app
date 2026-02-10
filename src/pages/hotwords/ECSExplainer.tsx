import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Activity, Box, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Types
type ComponentType = 'Position' | 'Health' | 'Velocity';

interface Entity {
    id: number;
    name: string;
    components: Record<ComponentType, any>;
}

const INITIAL_ENTITIES: Entity[] = [
    { id: 1, name: 'Hero', components: { Position: { x: 0, y: 0 }, Health: { hp: 100 }, Velocity: { x: 1, y: 0 } } },
    { id: 2, name: 'Enemy', components: { Position: { x: 10, y: 5 }, Health: { hp: 50 }, Velocity: { x: -1, y: 0 } } },
    { id: 3, name: 'Tree', components: { Position: { x: 5, y: 5 }, Health: { hp: 1000 }, Velocity: null } },
];

export const ECSExplainer: React.FC = () => {
    const [entities, setEntities] = useState<Entity[]>(INITIAL_ENTITIES);
    const [logs, setLogs] = useState<string[]>([]);

    const systemMove = () => {
        setLogs(prev => [...prev, '>>> MovementSystem Running...']);
        setEntities(prev => prev.map(ent => {
            if (ent.components.Velocity && ent.components.Position) {
                const newX = ent.components.Position.x + ent.components.Velocity.x;
                const newY = ent.components.Position.y + ent.components.Velocity.y;
                setLogs(prevLogs => [...prevLogs, `[Entity ${ent.id}] Move: (${ent.components.Position.x},${ent.components.Position.y}) -> (${newX},${newY})`]);
                return {
                    ...ent,
                    components: {
                        ...ent.components,
                        Position: { x: newX, y: newY }
                    }
                };
            }
            return ent;
        }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 mt-8">
            <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回热词列表
            </Link>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Database className="w-8 h-8 text-blue-600" />
                    ECS (Entity Component System)
                </h1>
                <p className="text-gray-600">
                    面向数据的架构模式。Entity 只是 ID，Component 存储数据，System 处理逻辑。
                    System 只关注拥有特定 Component 的 Entity，提高缓存命中率，便于并行。
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Entities Column */}
                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-lg border-b pb-2">
                        <Box className="w-5 h-5" /> 实体 (Entities / IDs)
                    </h3>
                    {entities.map(ent => (
                        <div key={ent.id} className="p-3 bg-white border rounded shadow-sm">
                            <div className="font-mono text-sm text-gray-500">ID: {ent.id}</div>
                            <div className="font-bold">{ent.name}</div>
                        </div>
                    ))}
                </div>

                {/* Components Data Column */}
                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-lg border-b pb-2">
                        <Database className="w-5 h-5" /> 组件 (Components / Data)
                    </h3>
                    {entities.map(ent => (
                        <motion.div 
                            layoutId={`comp-${ent.id}`}
                            key={ent.id} 
                            className="p-3 bg-gray-50 border rounded shadow-inner text-xs font-mono space-y-1"
                        >
                            {Object.entries(ent.components).map(([key, val]) => (
                                val && (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-blue-600 font-bold">{key}:</span> 
                                        <span>{JSON.stringify(val)}</span>
                                    </div>
                                )
                            ))}
                        </motion.div>
                    ))}
                </div>

                {/* System Logic Column */}
                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-lg border-b pb-2">
                        <Activity className="w-5 h-5" /> 系统 (Systems / Logic)
                    </h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <h4 className="font-bold text-blue-800 mb-2">移动系统 (MovementSystem)</h4>
                        <p className="text-xs text-blue-600 mb-4">
                            查询: [Position, Velocity]<br/>
                            逻辑: Pos += Vel
                        </p>
                        <button 
                            onClick={systemMove}
                            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                            <Activity className="w-4 h-4" /> 运行一帧 (Run Tick)
                        </button>
                    </div>

                    <div className="mt-4 p-2 bg-gray-900 text-green-400 text-xs font-mono rounded h-40 overflow-y-auto">
                        {logs.slice(-10).map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-yellow-50 p-4 rounded border border-yellow-200 text-sm">
                <strong>对比 OOP:</strong> 这里的 `Hero` 没有 `move()` 方法。它的数据分散在 `Position` 和 `Velocity` 数组中（虽然这里用对象模拟）。
                System 遍历的是紧凑的 Component 数组，这对 CPU Cache 非常友好。
            </div>
        </div>
    );
};
