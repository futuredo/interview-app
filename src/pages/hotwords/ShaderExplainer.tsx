import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShaderExplainer: React.FC = () => {
  const [mode, setMode] = useState<'standard' | 'grayscale' | 'heatmap'>('standard');
  
  // This is a "fake" visualizer using canvas to represent pixel shading
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Simulate Fragment Shader running for every pixel
      for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
              const i = (y * width + x) * 4;
              
              // Normalized coordinates (UV)
              const u = x / width;
              const v = y / height;

              let r=0, g=0, b=0;

              if (mode === 'standard') {
                  // Simple Gradient
                  r = u * 255;
                  g = v * 255;
                  b = 100;
              } else if (mode === 'grayscale') {
                  // Function: dot(color, vec3(0.299, 0.587, 0.114))
                  const baseR = u * 255;
                  const baseG = v * 255;
                  const baseB = 100;
                  const gray = baseR * 0.299 + baseG * 0.587 + baseB * 0.114;
                  r = g = b = gray;
              } else if (mode === 'heatmap') {
                  // Distance from center
                  const dx = u - 0.5;
                  const dy = v - 0.5;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  const heat = Math.max(0, 1 - dist * 2); // 1 at center, 0 at edges
                  r = heat * 255;
                  g = (1 - heat) * 50;
                  b = 0;
              }

              data[i] = r;
              data[i+1] = g;
              data[i+2] = b;
              data[i+3] = 255; // Alpha
          }
      }

      ctx.putImageData(imageData, 0, 0);

  }, [mode]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/hotwords" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <ArrowLeft size={24} />
        </Link>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">着色器 (Shader)</h2>
            <p className="text-slate-500 text-sm">Fragment Shader：并行计算每个像素的颜色。</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Output Display */}
          <div className="flex flex-col items-center">
              <div className="relative border-4 border-slate-800 rounded-lg shadow-lg bg-black">
                  <canvas 
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="block"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 rounded backdrop-blur-sm">
                      GPU 输出预览
                  </div>
              </div>
          </div>

          {/* Code/Logic Control */}
          <div className="space-y-6">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Zap size={18} className="text-yellow-500" /> Shader 代码片段
              </h3>

              <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setMode('standard')} 
                    className={`px-3 py-1 text-sm rounded border ${mode === 'standard' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'hover:bg-slate-50'}`}
                  >标准 UV</button>
                  <button 
                    onClick={() => setMode('grayscale')} 
                    className={`px-3 py-1 text-sm rounded border ${mode === 'grayscale' ? 'bg-slate-200 text-slate-700 border-slate-300' : 'hover:bg-slate-50'}`}
                  >灰度化 (Grayscale)</button>
                  <button 
                    onClick={() => setMode('heatmap')} 
                    className={`px-3 py-1 text-sm rounded border ${mode === 'heatmap' ? 'bg-red-100 text-red-700 border-red-300' : 'hover:bg-slate-50'}`}
                  >热力图 (Heatmap)</button>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-blue-300 overflow-x-auto">
<pre>{mode === 'standard' ? `void main() {
  vec2 uv = gl_FragCoord.xy / res;
  gl_FragColor = vec4(uv.x, uv.y, 0.4, 1.0);
}` : mode === 'grayscale' ? `void main() {
  vec4 color = texture(tex, uv);
  float gray = dot(color.rgb, 
    vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(vec3(gray), 1.0);
}` : `void main() {
  vec2 uv = gl_FragCoord.xy / res;
  float d = distance(uv, vec2(0.5));
  float heat = max(0.0, 1.0 - d * 2.0);
  gl_FragColor = vec4(heat, 0.2, 0.0, 1.0);
}`}</pre>
              </div>
              
              <p className="text-sm text-slate-500">
                  这段代码在 GPU 上并发运行了几万次 (每像素一次)，因此速度极快。
              </p>
          </div>

      </div>
    </div>
  );
};

export default ShaderExplainer;
