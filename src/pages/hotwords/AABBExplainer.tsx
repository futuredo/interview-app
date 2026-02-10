import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Box, Minimize, RotateCw, ArrowLeft } from 'lucide-react';

const AABBExplainer: React.FC = () => {
  const [mode, setMode] = useState<'AABB' | 'OBB'>('AABB');
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Player box state
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 150 });
  
  // Static obstacle
  const obstacle = { x: 200, y: 150, width: 100, height: 100 };
  
  // Derived State (No need for useEffect)
  const playerSize = 80;
  
  const checkAABB = (p: {x: number, y: number, w: number, h: number}, o: {x: number, y: number, w: number, h: number}) => {
    return (
      p.x < o.x + o.w &&
      p.x + p.w > o.x &&
      p.y < o.y + o.h &&
      p.y + p.h > o.y
    );
  };

  const checkOBB_Demo = (px: number, py: number, size: number, rot: number, ox: number, oy: number, oSize: number) => {
    // For visualization purposes, we'll cheat slightly:
    const dx = Math.abs(px + size/2 - (ox + oSize/2));
    const dy = Math.abs(py + size/2 - (oy + oSize/2));
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    // Threshold depends on rotation slightly
    const angleRad = (rot % 90) * (Math.PI / 180);
    const projectedHalfSize = (size/2) * (Math.cos(angleRad) + Math.sin(angleRad));
    
    return dist < (projectedHalfSize + oSize/2 - 10);
  };

  // Determine collision status during render
  let isColliding = false;
  if (mode === 'AABB') {
    isColliding = checkAABB(
      { x: playerPos.x, y: playerPos.y, w: playerSize, h: playerSize },
      { x: obstacle.x, y: obstacle.y, w: obstacle.width, h: obstacle.height }
    );
  } else {
    isColliding = checkOBB_Demo(playerPos.x, playerPos.y, playerSize, rotation, obstacle.x, obstacle.y, obstacle.width);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        返回热词列表
      </Link>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">碰撞检测: AABB vs OBB</h2>
        <p className="text-slate-600 mb-6">
          比较轴对齐包围盒 (AABB) 与 定向包围盒 (OBB) 的差异。
          <br/>
          <span className="text-sm text-slate-500">
            AABB 计算极快但不支持旋转。OBB 更精确，支持旋转，但计算成本(SAT算法)更高。
          </span>
        </p>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => { setMode('AABB'); setRotation(0); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'AABB' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AABB (轴对齐)
            </button>
            <button
              onClick={() => setMode('OBB')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'OBB' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OBB (可旋转)
            </button>
          </div>
        </div>

        {/* Interactive Area */}
        <div 
          ref={containerRef}
          className="relative h-80 bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden cursor-crosshair"
          onMouseMove={(e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - 40; // Center offset
            const y = e.clientY - rect.top - 40;
            setPlayerPos({ x, y });
          }}
          onClick={() => {
            if (mode === 'OBB') {
                setRotation(r => r + 45);
            }
          }}
        >
          <div className="absolute top-4 left-4 text-slate-400 text-sm select-none pointer-events-none">
            {mode === 'OBB' ? '点击区域以旋转物体' : '移动鼠标测试碰撞'}
          </div>

          {/* Obstacle */}
          <div 
            className="absolute bg-slate-300 border-2 border-slate-400 flex items-center justify-center text-slate-500 font-bold"
            style={{
              left: obstacle.x,
              top: obstacle.y,
              width: obstacle.width,
              height: obstacle.height,
            }}
          >
            WALL
          </div>

          {/* Player Box */}
          <motion.div
            className={`absolute flex items-center justify-center border-2 shadow-lg backdrop-blur-sm transition-colors duration-75 ${
              isColliding 
                ? 'bg-red-500/20 border-red-500 text-red-600' 
                : 'bg-blue-500/20 border-blue-500 text-blue-600'
            }`}
            animate={{
              x: playerPos.x,
              y: playerPos.y,
              rotate: rotation,
              scale: 1
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, rotate: { duration: 0.2 } }}
            style={{
              width: 80,
              height: 80,
            }}
          >
            <div className="flex flex-col items-center">
              <Box size={24} />
              <span className="text-xs font-mono mt-1">{Math.round(playerPos.x)},{Math.round(playerPos.y)}</span>
            </div>
          </motion.div>

          {/* AABB Bounding Box Visualization for OBB mode (to show waste) */}
          {mode === 'OBB' && rotation % 90 !== 0 && (
             <motion.div
                className="absolute border border-dashed border-slate-400 pointer-events-none opacity-40"
                animate={{
                    x: playerPos.x - 15, // Approximate expanding bounding box logic
                    y: playerPos.y - 15,
                    width: 110,
                    height: 110
                }}
             />
          )}

        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
           <div className={`p-4 rounded-lg border ${mode === 'AABB' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Minimize size={18} />
                AABB
              </h3>
              <ul className="text-sm space-y-2 text-slate-600">
                <li>• 检查: <code className="bg-white px-1 rounded">x_min &lt; x_max</code></li>
                <li>• 优点: 计算极快 (CPU友好)</li>
                <li>• 缺点: 旋转物体会产生巨大空隙</li>
              </ul>
           </div>
           <div className={`p-4 rounded-lg border ${mode === 'OBB' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <RotateCw size={18} />
                OBB
              </h3>
              <ul className="text-sm space-y-2 text-slate-600">
                <li>• 检查: 分离轴定理 (SAT)</li>
                <li>• 优点: 紧密包裹旋转物体</li>
                <li>• 缺点: 需多次向量投影，开销较大</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AABBExplainer;
