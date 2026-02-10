import React, { useState } from 'react';
import { Layers, ArrowRight, Image as ImageIcon, Box, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
    {
        id: 'ia', name: 'Input Assembler', 
        desc: '读取顶点数据 (Vertices) 和索引 (Indices)，组装成图元 (Primitives)。',
        icon: <Box /> 
    },
    {
        id: 'vs', name: 'Vertex Shader', 
        desc: '坐标变换 (Model -> View -> Projection)。将 3D 全局坐标转为 2D 裁剪空间坐标。',
        icon: <Box className="text-blue-500" />
    },
    {
        id: 'rs', name: 'Rasterizer', 
        desc: '光栅化。将连续的三角形离散化为屏幕上的像素 (Fragments)。',
        icon: <Layers className="text-orange-500" />
    },
    {
        id: 'fs', name: 'Fragment Shader', 
        desc: '片元着色。计算每个像素的最终颜色 (纹理, 光照, 阴影)。',
        icon: <ImageIcon className="text-purple-500" />
    },
    {
        id: 'om', name: 'Output Merger', 
        desc: '深度测试 (Z-Test) 与 混合 (Blending)，最终写入 Framebuffer。',
        icon: <ArrowRight className="text-green-500" />
    }
];

export const RenderingPipelineExplainer: React.FC = () => {
    const [step, setStep] = useState(0);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-12 mt-8">
            <div className="w-full flex justify-start mb-4">
                <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    返回热词列表
                </Link>
            </div>
            <header className="text-center">
                <h1 className="text-3xl font-bold mb-2">渲染管线 (Rendering Pipeline)</h1>
                <p className="text-gray-600">GPU 如何一帧一帧地画出游戏画面。</p>
            </header>

            {/* Stepper Visualization */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 px-4 overflow-x-auto pb-8">
                {STAGES.map((s, idx) => (
                    <React.Fragment key={s.id}>
                        <div 
                            onClick={() => setStep(idx)}
                            className={`
                                relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all min-w-[120px]
                                ${step === idx ? 'bg-blue-50 border-blue-500 scale-110 shadow-lg z-10' : 'bg-white border-gray-200 hover:border-blue-300'}
                            `}
                        >
                            <div className="mb-2 opacity-80">{s.icon}</div>
                            <div className="font-bold text-xs text-center">{s.name}</div>
                            {step === idx && (
                                <motion.div 
                                    layoutId="underline" 
                                    className="absolute -bottom-2 w-full h-1 bg-blue-500 rounded-full" 
                                />
                            )}
                        </div>
                        {idx < STAGES.length - 1 && (
                            <ArrowRight className="text-gray-300 w-6 h-6 shrink-0 rotate-90 md:rotate-0" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Detail View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[300px]">
                <div className="bg-gray-900 rounded-xl p-6 flex items-center justify-center overflow-hidden relative">
                    {/* Visual Placeholder for each stage */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-white text-center"
                        >
                            {step === 0 && (
                                <div className="space-y-2">
                                    <div className="text-6xl">🎲</div>
                                    <div className="font-mono text-sm text-green-400">Vertices[] = &#123; (0,1,0), (-1,-1,0)... &#125;</div>
                                </div>
                            )}
                            {step === 1 && (
                                <div className="space-y-4">
                                     <div className="text-6xl animate-pulse">📐</div>
                                     <div className="font-mono text-xs text-blue-300">gl_Position = MVP * vec4(pos, 1.0)</div>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="grid grid-cols-10 gap-1 w-40 mx-auto">
                                    {Array.from({length: 40}).map((_, i) => (
                                        <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-orange-500' : 'bg-gray-800'}`} />
                                    ))}
                                </div>
                            )}
                            {step === 3 && (
                                <div className="space-y-2">
                                     <div className="text-6xl">🎨</div>
                                     <div className="font-mono text-xs text-purple-300">color = texture(tex, uv) * light</div>
                                </div>
                            )}
                            {step === 4 && (
                                <div className="relative w-32 h-32 bg-white rounded shadow-lg overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80" />
                                     <div className="absolute top-0 text-black text-xs p-1 font-bold">Screen</div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">{STAGES[step].name}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {STAGES[step].desc}
                    </p>
                    
                    <div className="flex gap-2 pt-4">
                         <button 
                            disabled={step === 0}
                            onClick={() => setStep(s => s - 1)}
                            className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            上一步
                        </button>
                        <button 
                            disabled={step === STAGES.length - 1}
                            onClick={() => setStep(s => s + 1)}
                            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            下一步
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
