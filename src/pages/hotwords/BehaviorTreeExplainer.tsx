import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RefreshCw, AlertTriangle, Heart, Zap, Footprints, ArrowLeft } from 'lucide-react';

const COLORS: Record<string, string> = {
    running: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    failure: 'bg-red-100 border-red-500 text-red-700',
    idle: 'bg-white border-gray-300 text-gray-600',
};

type TreeNode = {
    id: string;
    type: 'root' | 'selector' | 'sequence' | 'condition' | 'action';
    name: string;
    status: 'idle' | 'running' | 'success' | 'failure';
    children?: TreeNode[];
};

const initialTreeData: TreeNode = {
    id: 'root',
    type: 'root',
    name: 'ROOT',
    status: 'idle',
    children: [
        {
            id: 'selector_main',
            type: 'selector',
            name: '优先策略 (Selector ?)',
            status: 'idle',
            children: [
                {
                    id: 'seq_survival',
                    type: 'sequence',
                    name: '生存模式 (Sequence ->)',
                    status: 'idle',
                    children: [
                        { id: 'cond_low_hp', type: 'condition', name: '生命值过低?', status: 'idle' },
                        { id: 'act_heal', type: 'action', name: '执行治疗', status: 'idle' },
                    ],
                },
                {
                    id: 'seq_combat',
                    type: 'sequence',
                    name: '战斗模式 (Sequence ->)',
                    status: 'idle',
                    children: [
                        { id: 'cond_enemy', type: 'condition', name: '发现敌人?', status: 'idle' },
                        { id: 'act_attack', type: 'action', name: '攻击敌人', status: 'idle' },
                    ],
                },
                {
                    id: 'act_patrol',
                    type: 'action',
                    name: '巡逻 (默认)',
                    status: 'idle',
                },
            ],
        },
    ],
};

export const BehaviorTreeExplainer: React.FC = () => {
    const [worldState, setWorldState] = useState({
        hp: 80,
        enemyInSight: false,
        logs: ['模拟器已启动...'],
    });
    const [treeData, setTreeData] = useState<TreeNode>(initialTreeData);
    const [lastAction, setLastAction] = useState('等待指令');
    const [autoPlay, setAutoPlay] = useState(false);

    const cloneTree = (node: TreeNode): TreeNode => ({
        ...node,
        children: node.children ? node.children.map(cloneTree) : undefined,
    });

    const tickTree = useCallback(() => {
        const newTree = cloneTree(initialTreeData);
        const newLogs: string[] = [];
        let actionResult = 'Idle';

        const executeNode = (node: TreeNode): TreeNode['status'] => {
            if (node.id === 'cond_low_hp') {
                const isLow = worldState.hp < 30;
                node.status = isLow ? 'success' : 'failure';
                newLogs.push(`[判断] 生命值(${worldState.hp}) < 30? ${isLow ? '是' : '否'}`);
                return node.status;
            }

            if (node.id === 'act_heal') {
                node.status = 'success';
                actionResult = '正在治疗... (+HP)';
                setWorldState((prev) => ({ ...prev, hp: Math.min(100, prev.hp + 20) }));
                newLogs.push('[动作] 执行治疗');
                return 'success';
            }

            if (node.id === 'cond_enemy') {
                const detected = worldState.enemyInSight;
                node.status = detected ? 'success' : 'failure';
                newLogs.push(`[判断] 发现敌人? ${detected ? '是' : '否'}`);
                return node.status;
            }

            if (node.id === 'act_attack') {
                node.status = 'success';
                actionResult = '正在攻击敌人! (Pew Pew)';
                newLogs.push('[动作] 攻击敌人');
                return 'success';
            }

            if (node.id === 'act_patrol') {
                node.status = 'success';
                actionResult = '正在巡逻...';
                newLogs.push('[动作] 巡逻中');
                return 'success';
            }

            if (node.type === 'selector' || node.type === 'root') {
                node.status = 'failure';
                if (!node.children) return node.status;
                for (const child of node.children) {
                    const result = executeNode(child);
                    if (result === 'success') {
                        node.status = 'success';
                        return 'success';
                    }
                    if (result === 'running') {
                        node.status = 'running';
                        return 'running';
                    }
                }
                return 'failure';
            }

            if (node.type === 'sequence') {
                if (!node.children) return 'success';
                for (const child of node.children) {
                    const result = executeNode(child);
                    if (result === 'failure') {
                        node.status = 'failure';
                        return 'failure';
                    }
                    if (result === 'running') {
                        node.status = 'running';
                        return 'running';
                    }
                }
                node.status = 'success';
                return 'success';
            }

            return 'success';
        };

        executeNode(newTree);
        setTreeData(newTree);
        setLastAction(actionResult);
        setWorldState((prev) => ({ ...prev, logs: [...newLogs.slice(-4)] }));
    }, [worldState.enemyInSight, worldState.hp]);

    useEffect(() => {
        if (!autoPlay) return undefined;
        const interval = setInterval(() => {
            tickTree();
        }, 1500);
        return () => clearInterval(interval);
    }, [autoPlay, tickTree]);

    const NodeView: React.FC<{ node: TreeNode }> = ({ node }) => {
        const statusColor = COLORS[node.status] || COLORS.idle;

        return (
            <div className="flex flex-col items-center">
                <div
                    className={`border-2 rounded-lg p-3 shadow-sm transition-all duration-300 w-40 text-center relative z-10 ${statusColor} ${
                        node.status !== 'idle' ? 'scale-105 font-bold shadow-md' : 'opacity-80'
                    }`}
                >
                    <div className="text-xs uppercase tracking-wider mb-1 opacity-70">
                        {node.type === 'selector' || node.type === 'sequence' || node.type === 'root' ? '组合节点' : '叶节点'}
                    </div>
                    <div className="text-sm">{node.name}</div>
                    <div
                        className={`absolute -right-1 -top-1 w-3 h-3 rounded-full border border-white ${
                            node.status === 'success'
                                ? 'bg-green-500'
                                : node.status === 'failure'
                                    ? 'bg-red-500'
                                    : 'bg-gray-300'
                        }`}
                    />
                </div>

                {node.children && node.children.length > 0 && (
                    <div className="flex flex-col items-center mt-4 relative">
                        <div className="w-0.5 h-4 bg-gray-300 mb-4 absolute -top-4" />

                        <div className="flex space-x-4 items-start relative">
                            {node.children.length > 1 && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-gray-300 w-[calc(100%-10rem)] -mt-0" />
                            )}

                            {node.children.map((child) => (
                                <div key={child.id} className="relative pt-4">
                                    {node.children && node.children.length > 1 && (
                                        <div className="absolute top-0 h-4 w-0.5 bg-gray-300 left-1/2 -translate-x-1/2 -mt-0" />
                                    )}
                                    <NodeView node={child} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 mt-8">
            <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回热词列表
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Zap className="text-blue-500" /> 行为树 (Behavior Tree) 模拟器
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">观察 AI 如何通过优先级树状结构做出决策。</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            autoPlay ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                    >
                        {autoPlay ? <Pause size={18} /> : <Play size={18} />}
                        {autoPlay ? '停止' : '自动运行'}
                    </button>
                    <button
                        onClick={tickTree}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium disabled:opacity-50"
                        disabled={autoPlay}
                    >
                        <RefreshCw size={18} />
                        单步执行 (Tick)
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-[500px]">
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8 overflow-auto flex justify-center items-start">
                    <NodeView node={treeData} />
                </div>

                <div className="w-80 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                            当前世界状态 (Blackboard)
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 font-medium">
                                    <Heart className={worldState.hp < 30 ? 'text-red-500 animate-pulse' : 'text-green-500'} size={20} />
                                    生命值
                                </span>
                                <span
                                    className={`text-lg font-mono ${
                                        worldState.hp < 30 ? 'text-red-600 font-bold' : 'text-gray-700'
                                    }`}
                                >
                                    {worldState.hp}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={worldState.hp}
                                onChange={(e) => setWorldState((state) => ({ ...state, hp: parseInt(e.target.value, 10) }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />

                            <div className="flex justify-between items-center pt-2">
                                <span className="flex items-center gap-2 font-medium">
                                    <AlertTriangle
                                        className={worldState.enemyInSight ? 'text-orange-500' : 'text-gray-400'}
                                        size={20}
                                    />
                                    发现敌人
                                </span>
                                <button
                                    onClick={() => setWorldState((state) => ({ ...state, enemyInSight: !state.enemyInSight }))}
                                    className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
                                        worldState.enemyInSight ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    {worldState.enemyInSight ? '是' : '否'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800 text-white p-4 rounded-xl shadow-sm flex flex-col justify-center items-center py-8">
                        <div className="text-gray-400 text-xs uppercase mb-2">AI 当前决策</div>
                        <div className="text-xl font-bold text-center flex items-center gap-2">
                            {lastAction.includes('巡逻') && <Footprints className="text-gray-400" />}
                            {lastAction.includes('攻击') && <Zap className="text-yellow-400" />}
                            {lastAction.includes('治疗') && <Heart className="text-red-400" />}
                            {lastAction}
                        </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-xl flex-1 border border-gray-200 overflow-hidden flex flex-col">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">决策日志</h2>
                        <div className="space-y-1 overflow-y-auto font-mono text-xs text-gray-600 flex-1">
                            {worldState.logs.map((log, i) => (
                                <div key={i} className="border-l-2 border-gray-300 pl-2 py-0.5">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-2 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                <strong>操作指南：</strong> 拖动右侧的生命值滑块（例如降到 30 以下），或切换“发现敌人”状态，然后点击
                <b>“单步执行”</b>。观察左侧行为树的亮灯路径，理解 AI 如何根据优先级选择行为。
            </div>
        </div>
    );
};
