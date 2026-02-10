import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, ArrowLeft } from 'lucide-react';

const LODExplainer: React.FC = () => {
  const [distance, setDistance] = useState(10);
  
  // LOD thresholds
  const LOD0_LIMIT = 30; // Close
  const LOD1_LIMIT = 60; // Medium
  // > 60 is LOD2 (Far)

  const getCurrentLOD = () => {
    if (distance < LOD0_LIMIT) return 0;
    if (distance < LOD1_LIMIT) return 1;
    return 2;
  };

  const level = getCurrentLOD();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        返回热词列表
      </Link>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">LOD (Level of Detail)</h2>
        <p className="text-slate-600 mb-8">
          根据摄像机距离切换模型精度，以节省渲染资源。
          <br/>
          <span className="text-sm text-slate-500">
            近处使用高模 (High Poly)，远处使用低模 (Low Poly) 或公告板。
          </span>
        </p>

        {/* Visualization Stage */}
        <div className="relative h-64 bg-slate-900 rounded-xl overflow-hidden mb-6 flex items-center justify-center perspective-1000">
            
            {/* Background Grid for depth feeling */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ 
                     backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                     backgroundSize: '40px 40px',
                     transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)'
                 }} 
            />

            {/* The Object */}
            <motion.div
                className="relative z-10"
                animate={{ 
                    scale: 1 / (distance / 20), // Simple perspective scale simulation
                    opacity: Math.max(0.4, 1 - distance / 150) // Fade out slightly at extreme distance
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                {/* LOD 0: High Poly Sphere */}
                {level === 0 && (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center border border-white/20">
                        <span className="text-white font-bold text-xs drop-shadow-md">LOD 0 (High)</span>
                    </div>
                )}

                {/* LOD 1: Low Poly Cube (simulated) */}
                {level === 1 && (
                     <div className="w-32 h-32 bg-blue-500 transform rotate-45 shadow-lg flex items-center justify-center border-4 border-blue-400">
                         <span className="text-white font-bold text-xs transform -rotate-45">LOD 1 (Med)</span>
                     </div>
                )}

                {/* LOD 2: Billboard / Triangle */}
                {level === 2 && (
                    <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-blue-700 flex items-center justify-center relative">
                        <span className="absolute top-16 text-white text-[10px] font-bold">LOD 2</span>
                    </div>
                )}
            </motion.div>

            {/* Camera Overlay Indicator */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded text-xs font-mono backdrop-blur-sm">
                Distance 距离: {distance}m
            </div>

        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Eye size={20} className="text-slate-500" />
            <label htmlFor="camera-distance" className="text-sm font-medium text-slate-700 w-16">Distance 距离:</label>
            <input 
                id="camera-distance"
                type="range" 
                min="10" 
                max="100" 
                value={distance} 
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm text-slate-500 w-12 text-right">{distance}m</span>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-3 gap-4 mt-6">
            <div className={`p-4 rounded border transition-colors ${level === 0 ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-100 opacity-50'}`}>
                <div className="font-bold text-slate-800 text-sm mb-1">LOD 0</div>
                <div className="text-xs text-slate-500">Distance &lt; 30m</div>
                <div className="mt-2 text-xs font-mono bg-white p-1 rounded border">Verts: 5000</div>
            </div>
             <div className={`p-4 rounded border transition-colors ${level === 1 ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-100 opacity-50'}`}>
                <div className="font-bold text-slate-800 text-sm mb-1">LOD 1</div>
                <div className="text-xs text-slate-500">30m - 60m</div>
                <div className="mt-2 text-xs font-mono bg-white p-1 rounded border">Verts: 1000</div>
            </div>
             <div className={`p-4 rounded border transition-colors ${level === 2 ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-100 opacity-50'}`}>
                <div className="font-bold text-slate-800 text-sm mb-1">LOD 2</div>
                <div className="text-xs text-slate-500">Distance &gt; 60m</div>
                <div className="mt-2 text-xs font-mono bg-white p-1 rounded border">Verts: 100</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LODExplainer;
