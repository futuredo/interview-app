import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const VTableExplainer: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'Base' | 'DerivedA' | 'DerivedB'>('Base');

  const methodMap = {
      'Base': { method: 'Base::Speak()', color: 'bg-slate-200 text-slate-600' },
      'DerivedA': { method: 'Dog::Speak() -> "Woof"', color: 'bg-blue-100 text-blue-700 border-blue-300' },
      'DerivedB': { method: 'Cat::Speak() -> "Meow"', color: 'bg-orange-100 text-orange-700 border-orange-300' }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/hotwords" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <ArrowLeft size={24} />
        </Link>
        <div>
            <h2 className="text-2xl font-bold text-slate-800">虚函数表 (v-table)</h2>
            <p className="text-slate-500 text-sm">多态的底层实现：通过 vptr 查找正确的函数地址。</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          
          <div className="flex flex-col items-center gap-8 py-8">
              
              {/* Controls */}
              <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedType('DerivedA')}
                    className={`px-4 py-2 rounded-lg border ${selectedType === 'DerivedA' ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}
                  >
                      new Dog()
                  </button>
                  <button 
                    onClick={() => setSelectedType('DerivedB')}
                    className={`px-4 py-2 rounded-lg border ${selectedType === 'DerivedB' ? 'bg-orange-600 text-white' : 'hover:bg-slate-50'}`}
                  >
                      new Cat()
                  </button>
              </div>

              {/* Memory Layout */}
              <div className="flex flex-col md:flex-row gap-16 items-start">
                  
                  {/* Object in Memory */}
                  <div className="w-48 border-2 border-slate-800 rounded-lg overflow-hidden bg-slate-50 shadow-lg">
                      <div className="bg-slate-800 text-white text-center py-2 text-sm font-mono">
                          对象内存布局
                      </div>
                      <div className="p-4 border-b border-slate-200 bg-yellow-100 flex justify-between items-center group relative cursor-help">
                          <span className="font-mono font-bold text-sm">*vptr</span>
                          <span className="text-[10px] text-slate-500">0x00A1</span>
                          
                          {/* Pointer Line */}
                          <div className="absolute right-0 top-1/2 w-16 h-0.5 bg-slate-400 translate-x-full"></div>
                      </div>
                      <div className="p-4 text-sm text-slate-400 text-center italic">
                          (成员变量数据...)
                      </div>
                  </div>

                  {/* V-Table */}
                  <div className="relative">
                      <div className="w-56 border border-slate-300 rounded-lg overflow-hidden bg-white shadow-md">
                          <div className="bg-slate-100 text-slate-600 text-center py-2 text-xs font-bold border-b border-slate-200">
                              虚表 V-Table ({selectedType})
                          </div>
                          
                          <div className="p-2 space-y-2">
                              {/* Function Slot */}
                              <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-slate-400">[0]</span>
                                  <motion.div 
                                    className={`flex-1 p-2 rounded text-xs font-mono border ${methodMap[selectedType].color}`}
                                    layoutId="method-slot"
                                  >
                                      {methodMap[selectedType].method}
                                  </motion.div>
                              </div>
                              <div className="flex items-center gap-2 opacity-50">
                                  <span className="text-xs font-mono text-slate-400">[1]</span>
                                  <div className="flex-1 p-2 rounded text-xs font-mono bg-slate-100 border border-slate-200">
                                      Animal::Eat()
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Connection Line */}
                       <svg className="absolute top-10 -left-16 w-16 h-10 pointer-events-none text-slate-400" overflow="visible">
                           <path d="M -20,0 L 0,0" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" />
                           <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                                </marker>
                            </defs>
                       </svg>
                  </div>

              </div>

              <div className="text-center max-w-lg text-sm text-slate-600">
                  <p>
                      当调用 <code className="bg-slate-100 px-1 rounded">ptr-&gt;Speak()</code> 时，
                      编译器实际上生成了类似 <code className="bg-slate-100 px-1 rounded">ptr-&gt;vptr[0]()</code> 的代码。
                      <br/>
                      这增加了一次内存寻址（Pointer Dereference），因此比非虚函数微慢。
                  </p>
              </div>

          </div>
      </div>
    </div>
  );
};

export default VTableExplainer;
