import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuaternionExplainer: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 }); // Euler representations
  const [useQuaternion, setUseQuaternion] = useState(false);
  const [gimbalLock, setGimbalLock] = useState(false);

  // In this simplified visualizer, we simulate the *effect* of gimbal lock
  // by constraining the X rotation if Y is at 90 degrees in Euler mode, unless Quaternion is on.
  
  const handleRotate = (axis: 'x' | 'y' | 'z', val: number) => {
    setRotation(prev => {
        let next = { ...prev, [axis]: val };
        
        // Simulating Gimbal Lock Visual Effect
        // If Pitch (X) is 90, Yaw (Y) and Roll (Z) axes align, losing one degree of freedom.
        // For visual simplicity in CSS 3D:
        // We will just show a warning or limit the rotation if locked.
        
        const isLocked = !useQuaternion && Math.abs(prev.x) >= 85; 
        setGimbalLock(isLocked);

        return next;
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/hotwords" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <ArrowLeft size={24} />
        </Link>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">四元数 (Quaternion) vs 欧拉角</h2>
            <p className="text-slate-500 text-sm">解决万向节锁 (Gimbal Lock) 与平滑插值 (Slerp)。</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700">旋转模式 (Rotation Mode)</h3>
                <button 
                    onClick={() => { setUseQuaternion(!useQuaternion); setRotation({x:0,y:0,z:0}); }}
                    className={`text-xs px-2 py-1 rounded border ${useQuaternion ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}
                >
                    {useQuaternion ? '四元数 (Quaternion)' : '欧拉角 (Euler X/Y/Z)'}
                </button>
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500">俯仰 Pitch (X) - <span className="text-red-500">红轴</span></label>
                      <input 
                        type="range" min="-180" max="180" value={rotation.x} 
                        onChange={(e) => handleRotate('x', Number(e.target.value))}
                        className="w-full"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500">偏航 Yaw (Y) - <span className="text-green-500">绿轴</span></label>
                      <input 
                        type="range" min="-180" max="180" value={rotation.y} 
                        onChange={(e) => handleRotate('y', Number(e.target.value))}
                         className="w-full"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500">翻滚 Roll (Z) - <span className="text-blue-500">蓝轴</span></label>
                      <input 
                        type="range" min="-180" max="180" value={rotation.z} 
                        onChange={(e) => handleRotate('z', Number(e.target.value))}
                         className="w-full"
                      />
                  </div>
              </div>
              
              <div className={`p-4 rounded border text-sm ${gimbalLock ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  {gimbalLock ? (
                      <div className="flex items-center gap-2">
                          <RotateCw className="animate-spin" /> 
                          <strong>检测到万向节死锁 (GIMBAL LOCK)!</strong>
                          <br/>Z轴旋转现在与Y轴处于同一平面，丢失了一个自由度。
                      </div>
                  ) : (
                      "提示：在欧拉模式下将 X 轴旋转到 90 度以观察死锁现象。"
                  )}
              </div>
          </div>

          {/* 3D Visualization Wrapper */}
          <div className="col-span-2 bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden h-[400px] perspective-1000">
               {/* Grid */}
               <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                     backgroundSize: '40px 40px',
                 }} 
               />
               
               {/* The Airplane Object */}
               <motion.div
                 className="relative w-40 h-12 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center transform-style-3d"
                 animate={{
                    rotateX: rotation.x,
                    rotateY: rotation.y,
                    rotateZ: rotation.z,
                 }}
                 transition={{ type: 'tween', duration: 0.1 }} // Instant reaction for sliders
               >
                   {/* Wings */}
                   <div className="absolute w-12 h-48 bg-slate-300 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90"></div>
                   {/* Tail */}
                   <div className="absolute w-4 h-16 bg-red-400 rounded-t-lg -top-8 right-4 origin-bottom transform -skew-x-12 opactiy-90"></div>
                   
                   {/* Axis Indicators (Local Space) */}
                   <div className="absolute w-24 h-0.5 bg-red-500 left-1/2 top-1/2"></div> {/* X */}
                   <div className="absolute w-0.5 h-24 bg-green-500 left-1/2 top-1/2 -translate-y-1/2"></div> {/* Y */}
                   <div className="absolute w-4 h-4 rounded-full bg-blue-500 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div> {/* Z (Coming at camera) */}
                   
                   <span className="relative z-10 font-bold text-slate-800 text-xs">MODEL</span>
               </motion.div>

               <div className="absolute bottom-4 right-4 text-white text-xs font-mono text-right">
                   <div>X: {rotation.x}°</div>
                   <div>Y: {rotation.y}°</div>
                   <div>Z: {rotation.z}°</div>
                   <div className="mt-2 text-slate-400">
                       当前模式: {useQuaternion ? '四元数 (Quaternion)' : '欧拉角 (Euler)'}
                   </div>
               </div>
          </div>

      </div>
    </div>
  );
};

export default QuaternionExplainer;
