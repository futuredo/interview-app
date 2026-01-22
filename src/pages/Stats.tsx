import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Clock3, Globe2, RefreshCw, TrendingUp } from 'lucide-react';

interface RegionShare {
  name: string;
  percent: number;
}

interface StatsState {
  totalVisits: number;
  lastUpdatedDate: string;
  avgDurationMinutes: number;
  regionShares: RegionShare[];
  todayIncrement: number;
}

const STORAGE_KEY = 'mock-traffic-stats';
const TODAY = () => new Date().toISOString().slice(0, 10);

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRegionShares = (): RegionShare[] => {
  // Overseas first, then Sichuan/Shandong with higher weights, others random.
  const overseas = randomInt(30, 38);
  const sichuan = randomInt(15, 20);
  const shandong = randomInt(12, 18);
  const othersCount = 5;
  const remaining = Math.max(100 - (overseas + sichuan + shandong), 10);

  const otherProvinces = ['北京', '上海', '广东', '浙江', '江苏', '湖北', '湖南', '福建', '陕西', '云南'];
  const picked = otherProvinces.sort(() => 0.5 - Math.random()).slice(0, othersCount);

  const randomWeights = picked.map(() => randomInt(5, 12));
  const weightSum = randomWeights.reduce((a, b) => a + b, 0);
  const scaled = randomWeights.map((w) => Math.max(Math.round((w / weightSum) * remaining), 1));
  const scaledTotal = scaled.reduce((a, b) => a + b, 0);
  const diff = remaining - scaledTotal;
  if (diff !== 0 && scaled.length) {
    scaled[0] += diff; // adjust rounding drift
  }

  const regions: RegionShare[] = [
    { name: '海外', percent: overseas },
    { name: '四川', percent: sichuan },
    { name: '山东', percent: shandong },
    ...picked.map((name, idx) => ({ name, percent: scaled[idx] })),
  ];

  return regions.sort((a, b) => b.percent - a.percent);
};

const buildInitialState = (): StatsState => ({
  totalVisits: 168,
  lastUpdatedDate: TODAY(),
  avgDurationMinutes: randomInt(22, 45),
  regionShares: generateRegionShares(),
  todayIncrement: 0,
});

export const Stats: React.FC = () => {
  const [stats, setStats] = useState<StatsState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as StatsState;
      } catch (e) {
        console.warn('Failed to parse stored stats, resetting.', e);
      }
    }
    return buildInitialState();
  });

  const initialized = useRef(false);

  const syncStats = useCallback((fromTimer = false) => {
    const today = TODAY();
    let next: StatsState = { ...stats };

    if (!fromTimer) {
      // Count the current visit.
      next.totalVisits += 2;
      next.todayIncrement = (next.todayIncrement || 0) + 2;
    }

    if (next.lastUpdatedDate !== today) {
      const dailyGrowth = randomInt(41, 65);
      next = {
        ...next,
        totalVisits: next.totalVisits + dailyGrowth,
        todayIncrement: dailyGrowth + (fromTimer ? 0 : 2),
        avgDurationMinutes: randomInt(20, 45),
        regionShares: generateRegionShares(),
        lastUpdatedDate: today,
      };
    }

    setStats(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [stats]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    syncStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => syncStats(true), 60 * 60 * 1000); // hourly check for daily rollover
    return () => clearInterval(id);
  }, [syncStats]);

  const totalVisitsDisplay = useMemo(() => stats.totalVisits.toLocaleString('en-US'), [stats.totalVisits]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">数据统计</p>
          <h1 className="text-2xl font-bold text-[var(--color-text-main)] mt-1">站点流量概览</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">初始值 168，每次访问 +2，日增 40+ 随机</p>
        </div>
        <button
          onClick={() => syncStats()}
          className="btn-secondary gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          手动刷新
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">累计访问量</p>
              <p className="text-3xl font-bold mt-2 text-[var(--color-text-main)]">{totalVisitsDisplay}</p>
            </div>
            <Activity className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3">自动累加，含当前访问 +2</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">今日新增</p>
              <p className="text-3xl font-bold mt-2 text-[var(--color-text-main)]">{stats.todayIncrement}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3">日增随机 40+，含访问加成</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">人均使用时长</p>
              <p className="text-3xl font-bold mt-2 text-[var(--color-text-main)]">{stats.avgDurationMinutes} 分钟</p>
            </div>
            <Clock3 className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3">随机值，不低于 20 分钟</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">地区占比</p>
            <h2 className="text-xl font-semibold text-[var(--color-text-main)] mt-1">按 IP 归属地</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">海外优先，其次四川、山东，其余随机</p>
          </div>
          <Globe2 className="w-6 h-6 text-[var(--color-primary)]" />
        </div>

        <div className="space-y-3">
          {stats.regionShares.map((region) => (
            <div key={region.name} className="w-full">
              <div className="flex justify-between text-sm text-[var(--color-text-main)] mb-1">
                <span>{region.name}</span>
                <span className="text-[var(--color-text-secondary)]">{region.percent}%</span>
              </div>
              <div className="w-full bg-[var(--color-hover)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${Math.min(region.percent, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
