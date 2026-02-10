import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Factory, Sword, Wand, Shield, Plus, ArrowLeft } from 'lucide-react';

type ProductType = 'warrior' | 'mage' | 'guard';

interface Product {
  id: number;
  type: ProductType;
}

const FactoryExplainer: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [producing, setProducing] = useState<ProductType | null>(null);

  const createUnit = (type: ProductType) => {
    if (producing) return;
    setProducing(type);
    
    // Simulate production time
    setTimeout(() => {
      setProducts(prev => [...prev, { id: Date.now(), type }]);
      setProducing(null);
    }, 800);
  };

  const getIcon = (type: ProductType) => {
    switch(type) {
      case 'warrior': return <Sword size={20} />;
      case 'mage': return <Wand size={20} />;
      case 'guard': return <Shield size={20} />;
    }
  };

  const getColor = (type: ProductType) => {
    switch(type) {
      case 'warrior': return 'bg-red-100 text-red-600 border-red-200';
      case 'mage': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'guard': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
    }
  };

  const getLabel = (type: ProductType) => {
     switch(type) {
        case 'warrior': return 'Warrior';
        case 'mage': return 'Mage';
        case 'guard': return 'Guard';
      }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 mt-8">
      <Link to="/hotwords" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        返回热词列表
      </Link>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">工厂模式 (Factory Pattern)</h2>
        <p className="text-slate-600 mb-8">
          将对象的创建逻辑封装在工厂类中，客户端无需关心具体类的实例化过程。
          <br/>
          <span className="text-sm text-slate-500">
            "给我一个战士"，而不是 new Warrior()。方便解耦和扩展。
          </span>
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Controls / Client Side */}
          <div className="w-full md:w-1/3 space-y-4">
            <h3 className="font-bold text-slate-700 border-b pb-2">Client Request</h3>
            <button
              onClick={() => createUnit('warrior')}
              disabled={!!producing}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-red-100 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <div className="bg-red-100 p-2 rounded text-red-600"><Sword size={18} /></div>
              <div>
                <div className="font-medium text-slate-800">创建战士 (Create Warrior)</div>
                <div className="text-xs text-slate-500">factory.create('warrior')</div>
              </div>
            </button>

            <button
              onClick={() => createUnit('mage')}
              disabled={!!producing}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors disabled:opacity-50"
            >
               <div className="bg-purple-100 p-2 rounded text-purple-600"><Wand size={18} /></div>
              <div>
                <div className="font-medium text-slate-800">创建法师 (Create Mage)</div>
                <div className="text-xs text-slate-500">factory.create('mage')</div>
              </div>
            </button>

            <button
              onClick={() => createUnit('guard')}
              disabled={!!producing}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors disabled:opacity-50"
            >
               <div className="bg-emerald-100 p-2 rounded text-emerald-600"><Shield size={18} /></div>
              <div>
                <div className="font-medium text-slate-800">创建守卫 (Create Guard)</div>
                <div className="text-xs text-slate-500">factory.create('guard')</div>
              </div>
            </button>
          </div>

          {/* The Factory Visualization */}
          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-6 min-h-[300px] flex flex-col items-center relative overflow-hidden">
            
            {/* Factory Building */}
            <div className="mb-12 relative z-10">
                <div className="w-32 h-24 bg-slate-800 rounded-lg flex items-center justify-center text-white shadow-xl relative">
                    <Factory size={48} />
                    {producing && (
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1"
                        >
                            <div className="animate-spin"><Plus size={16} className="text-black" /></div>
                        </motion.div>
                    )}
                </div>
                <div className="text-center mt-2 font-mono text-sm font-bold text-slate-700">UnitFactory</div>
            </div>

            {/* Production Animation */}
            <AnimatePresence>
                {producing && (
                    <motion.div
                        initial={{ y: -60, opacity: 0, scale: 0.5 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 p-4 rounded-full shadow-lg border-2 ${getColor(producing)} bg-white`}
                    >
                        {getIcon(producing)}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Output Queue */}
            <div className="w-full flex gap-3 flex-wrap justify-center mt-auto border-t border-slate-200 pt-4 px-2 bg-white/50 rounded-lg min-h-[80px]">
                 <AnimatePresence>
                    {products.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className={`flex flex-col items-center gap-1 p-2 rounded border ${getColor(p.type)} bg-white shadow-sm`}
                        >
                            {getIcon(p.type)}
                            <span className="text-[10px] font-bold uppercase">{getLabel(p.type)}</span>
                        </motion.div>
                    ))}
                    {products.length === 0 && (
                        <div className="text-slate-400 text-sm italic self-center">暂无产出产品 (Empty)</div>
                    )}
                 </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Code Snippet */}
        <div className="mt-8 bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto">
<pre>{`class UnitFactory {
  create(type) {
    switch(type) {
      case 'warrior': return new Warrior();
      case 'mage':    return new Mage();
      case 'guard':   return new Guard();
      default: throw new Error('Unknown unit type');
    }
  }
}

// Client Code
const factory = new UnitFactory();
const hero = factory.create('warrior'); // Returns Warrior instance`}</pre>
        </div>
      </div>
    </div>
  );
};

export default FactoryExplainer;
