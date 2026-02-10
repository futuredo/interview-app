import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scan, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReflectionExplainer: React.FC = () => {
  const [scannedData, setScannedData] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Mock Object in memory
  const secretObject = {
      type: 'EnemyBoss',
      health: 5000,
      private_lootTable: ['Gold', 'RareSword'],
      method_Attack: () => "Deals 50 dmg"
  };

  const runReflection = () => {
    setIsScanning(true);
    setScannedData([]);
    
    // Simulate reflection delay
    setTimeout(() => {
        const keys = Object.keys(secretObject);
        setScannedData(keys);
        setIsScanning(false);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/hotwords" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <ArrowLeft size={24} />
        </Link>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">反射 (Reflection)</h2>
            <p className="text-slate-500 text-sm">运行时检查类型信息、获取属性与方法。</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center py-12">
              
              {/* Unknown Object */}
              <div className="relative group">
                  <div className="w-40 h-40 bg-slate-800 rounded-xl flex items-center justify-center shadow-xl border-4 border-slate-600">
                      <span className="text-6xl">?</span>
                  </div>
                  <div className="text-center mt-4 font-mono text-sm text-slate-500">未知对象 (Unknown)<br/>(Addr: 0x3F2A)</div>

                  {/* Scan Beam */}
                  <AnimatePresence>
                    {isScanning && (
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 200, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="absolute top-1/2 left-full h-[2px] bg-green-500 shadow-[0_0_10px_#22c55e]"
                        />
                    )}
                  </AnimatePresence>
              </div>

              {/* Reflector / Type Info */}
              <div className="w-64">
                  <button 
                    onClick={runReflection}
                    disabled={isScanning}
                    className="w-full mb-4 bg-green-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
                  >
                      {isScanning ? <Scan className="animate-spin" /> : <Search />}
                      执行 GetType()
                  </button>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm relative">
                      {!isScanning && scannedData.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">等待扫描...</div>
                      )}
                      
                      <ul className="space-y-2">
                        {scannedData.map((key, i) => (
                            <motion.li 
                                key={key}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-slate-100 p-2 rounded shadow-sm text-slate-700"
                            >
                                <span className={key.startsWith('method') ? 'text-purple-600' : 'text-blue-600'}>
                                    {key.startsWith('method') ? '[Method]' : '[Field]'}
                                </span> 
                                {' ' + key}
                            </motion.li>
                        ))}
                      </ul>
                  </div>
              </div>

          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800 text-sm">
              <strong>注意：</strong> 反射虽然强大（用于序列化、编辑器Inspector、依赖注入），但性能开销较大，且避开了编译期类型检查。
          </div>
      </div>
    </div>
  );
};

export default ReflectionExplainer;
