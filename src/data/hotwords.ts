export interface HotwordPage {
    id: string;
    title: string;
    description: string;
    path: string;
    tag: string;
}

export const hotwordPages: HotwordPage[] = [
    {
        id: 'behavior-tree',
        title: '行为树 (Behavior Tree)',
        description: '用可视化方式理解 Selector/Sequence 的决策流程。',
        path: '/hotwords/behavior-tree',
        tag: 'AI',
    },
    {
        id: 'ecs',
        title: 'ECS 架构 (Entity Component System)',
        description: '数据驱动架构：Entity 只是 ID，Component 存数据，System 做逻辑。',
        path: '/hotwords/ecs',
        tag: 'Architecture',
    },
    {
        id: 'fsm',
        title: '有限状态机 (FSM)',
        description: '状态管理基础：状态转换条件与生命周期管理。',
        path: '/hotwords/fsm',
        tag: 'AI',
    },
    {
        id: 'observer',
        title: '观察者模式 (Observer)',
        description: '事件系统核心：解耦发布者与订阅者。',
        path: '/hotwords/observer',
        tag: 'Architecture',
    },
    {
        id: 'singleton',
        title: '单例模式 (Singleton)',
        description: '全局唯一实例：优缺点与线程安全问题探讨。',
        path: '/hotwords/singleton',
        tag: 'Architecture',
    },
    {
        id: 'object-pool',
        title: '对象池 (Object Pool)',
        description: '内存优化利器：避免高频 Instantiate/Destroy 带来的性能开销。',
        path: '/hotwords/object-pool',
        tag: 'Performance',
    },
    {
        id: 'vector-math',
        title: '向量数学 (Vector Math)',
        description: '点乘判前后，叉乘判左右。交互式向量运算演示。',
        path: '/hotwords/vector-math',
        tag: 'Math',
    },
    {
        id: 'rendering-pipeline',
        title: '渲染管线 (Rendering Pipeline)',
        description: '从顶点到像素：GPU 如何画出一帧画面。',
        path: '/hotwords/rendering-pipeline',
        tag: 'Rendering',
    },
    {
        id: 'factory',
        title: '工厂模式 (Factory Pattern)',
        description: '封装对象创建逻辑，实现解耦与扩展。',
        path: '/hotwords/factory',
        tag: 'Architecture',
    },
    {
        id: 'gc',
        title: '垃圾回收 (Garbage Collection)',
        description: 'Mark-and-Sweep 标记清除算法的可视化演示。',
        path: '/hotwords/gc',
        tag: 'Performance',
    },
    {
        id: 'heap-stack',
        title: '堆与栈 (Heap vs Stack)',
        description: '内存管理核心：栈的有序性与堆的灵活性对比。',
        path: '/hotwords/heap-stack',
        tag: 'Performance',
    },
    {
        id: 'aabb',
        title: '碰撞检测 (AABB/OBB)',
        description: '轴对齐包围盒 vs 定向包围盒的碰撞逻辑。',
        path: '/hotwords/aabb',
        tag: 'Algorithm',
    },
    {
        id: 'lod',
        title: 'LOD (Level of Detail)',
        description: '渲染优化：依据距离动态切换模型精度。',
        path: '/hotwords/lod',
        tag: 'Rendering',
    },
    {
        id: 'quaternion',
        title: 'Quaternion (四元数)',
        description: '数学基础：解决万向节锁与旋转插值。',
        path: '/hotwords/quaternion',
        tag: 'Math',
    },
    {
        id: 'coroutine',
        title: 'Coroutine (协程)',
        description: '异步逻辑：时间分片与非阻塞执行原理。',
        path: '/hotwords/coroutine',
        tag: 'Code',
    },
    {
        id: 'reflection',
        title: 'Reflection (反射)',
        description: '运行时类型检查与元数据获取。',
        path: '/hotwords/reflection',
        tag: 'Code',
    },
    {
        id: 'vtable',
        title: 'Virtual Table (虚表)',
        description: '多态底层：vptr 与虚函数表的内存布局。',
        path: '/hotwords/vtable',
        tag: 'Architecture',
    },
    {
        id: 'shader',
        title: 'Shader (着色器)',
        description: 'GPU编程：Fragment Shader 像素级操作演示。',
        path: '/hotwords/shader',
        tag: 'Rendering',
    },
    // 预留位置，后续实现
];
