import React, { useState, useRef } from 'react';
import { Ruler, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Simple Vector type
type Vec2 = { x: number, y: number };

export const VectorMathExplainer: React.FC = () => {
    // Canvas center is (200, 200)
    const center = { x: 200, y: 200 };
    
    // Vector A and B endpoints (relative to center)
    const [vecA, setVecA] = useState<Vec2>({ x: 100, y: 0 });
    const [vecB, setVecB] = useState<Vec2>({ x: 0, y: -100 });
    
    const svgRef = useRef<SVGSVGElement>(null);
    const [dragging, setDragging] = useState<'A' | 'B' | null>(null);

    // Helpers
    const magnitude = (v: Vec2) => Math.sqrt(v.x * v.x + v.y * v.y);
    const normalize = (v: Vec2) => {
        const m = magnitude(v);
        return m === 0 ? { x: 0, y: 0 } : { x: v.x / m, y: v.y / m };
    };
    const dot = (a: Vec2, b: Vec2) => a.x * b.x + a.y * b.y;
    const cross2D = (a: Vec2, b: Vec2) => a.x * b.y - a.y * b.x; // Z component of 3D Cross Product
    const toDeg = (rad: number) => rad * (180 / Math.PI);

    // Derived values
    const normA = normalize(vecA);
    const normB = normalize(vecB);
    const dotVal = dot(normA, normB); // Using normalized for angle logic clarity
    const rawDot = dot(vecA, vecB);
    const crossVal = cross2D(vecA, vecB);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, dotVal)));
    const angleDeg = toDeg(angleRad);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging || !svgRef.current) return;
        
        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const newVec = {
            x: mouseX - center.x,
            y: mouseY - center.y
        };

        if (dragging === 'A') setVecA(newVec);
        if (dragging === 'B') setVecB(newVec);
    };

    const handleMouseUp = () => setDragging(null);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
            <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回热词列表
            </Link>
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                    <Ruler className="text-purple-600" />
                    向量运算 (Vector Math)
                </h1>
                <p className="text-gray-600">
                    拖动箭头端点改变向量。<strong className="text-purple-600">红色是 A</strong>，<strong className="text-blue-600">蓝色是 B</strong>。
                    坐标系：右为 X 正，下为 Y 正（屏幕坐标）。
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Area */}
                <div 
                    className="border-2 border-gray-200 rounded-xl bg-white shadow-inner relative overflow-hidden"
                    style={{ height: '400px', cursor: dragging ? 'grabbing' : 'default' }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="absolute top-2 left-2 text-xs text-gray-400 font-mono pointer-events-none">
                        画布空间 (400x400)
                    </div>
                    
                    <svg 
                        ref={svgRef} 
                        width="100%" 
                        height="100%" 
                        viewBox="0 0 400 400"
                        className="w-full h-full"
                    >
                        {/* Grid Lines */}
                        <line x1="200" y1="0" x2="200" y2="400" stroke="#eee" strokeWidth="1" />
                        <line x1="0" y1="200" x2="400" y2="200" stroke="#eee" strokeWidth="1" />

                        {/* Vector A */}
                        <line 
                            x1={center.x} y1={center.y} 
                            x2={center.x + vecA.x} y2={center.y + vecA.y} 
                            stroke="#dc2626" 
                            strokeWidth="4" 
                            markerEnd="url(#arrowheadA)"
                        />
                        <circle 
                            cx={center.x + vecA.x} cy={center.y + vecA.y} 
                            r="8" 
                            fill={dragging === 'A' ? '#991b1b' : '#ef4444'} 
                            style={{ cursor: 'grab' }}
                            onMouseDown={() => setDragging('A')}
                        />

                        {/* Vector B */}
                        <line 
                            x1={center.x} y1={center.y} 
                            x2={center.x + vecB.x} y2={center.y + vecB.y} 
                            stroke="#2563eb" 
                            strokeWidth="4" 
                            markerEnd="url(#arrowheadB)"
                        />
                        <circle 
                            cx={center.x + vecB.x} cy={center.y + vecB.y} 
                            r="8" 
                            fill={dragging === 'B' ? '#1e40af' : '#3b82f6'} 
                            style={{ cursor: 'grab' }}
                            onMouseDown={() => setDragging('B')}
                        />

                        {/* Angle Arc (Approximate) */}
                        <path 
                            d={`M ${center.x + normA.x * 40} ${center.y + normA.y * 40} 
                                A 40 40 0 0 ${crossVal > 0 ? 1 : 0} 
                                ${center.x + normB.x * 40} ${center.y + normB.y * 40}`}
                            stroke="orange"
                            fill="none"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                        />

                        <defs>
                            <marker id="arrowheadA" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
                            </marker>
                            <marker id="arrowheadB" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                            </marker>
                        </defs>
                    </svg>
                </div>

                {/* Data Panel */}
                <div className="space-y-6">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <h3 className="font-bold text-lg mb-2 text-purple-900">点乘 (Dot Product)</h3>
                        <div className="font-mono text-2xl mb-1">{rawDot.toFixed(0)}</div>
                        <div className="text-sm text-gray-600 mb-2">公式: A.x * B.x + A.y * B.y</div>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>结果 &gt; 0: 方向基本相同 (前)</li>
                            <li>结果 = 0: 垂直 (Perpendicular)</li>
                            <li>结果 &lt; 0: 方向基本相反 (后)</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <h3 className="font-bold text-lg mb-2 text-orange-900">叉乘 (Cross Product 2D)</h3>
                        <div className="font-mono text-2xl mb-1">{crossVal.toFixed(0)}</div>
                        <div className="text-sm text-gray-600 mb-2">公式: A.x * B.y - A.y * B.x</div>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>结果 &gt; 0: B 在 A 的右侧 (顺时针)</li>
                            <li>结果 &lt; 0: B 在 A 的左侧 (逆时针)</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-bold text-lg mb-2">夹角 (Angle)</h3>
                        <div className="font-mono text-2xl">{angleDeg.toFixed(1)}°</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
