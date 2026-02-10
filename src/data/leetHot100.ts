export interface HotOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface HotQuestion {
    id: string;
    question: string;
    options: HotOption[];
    rationale: string;
    hint: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questionType: 'single' | 'multi' | 'truefalse';
}

export const hot100Questions: HotQuestion[] = [
    {
        id: 'two-sum-1',
        question: '给定一个整数数组 nums 和一个目标值 target，请找出和为 target 的两个整数下标。',
        options: [
            { id: 'a', text: '排序 + 双指针', isCorrect: false },
            { id: 'b', text: '哈希表记录补数位置', isCorrect: true },
            { id: 'c', text: '单调栈', isCorrect: false },
            { id: 'd', text: '前缀和 + 二分', isCorrect: false },
        ],
        rationale: '用哈希表记录已遍历元素的值到下标映射，当前值 x 只需查找 target - x 是否出现。',
        hint: '空间换时间，边遍历边查找补数。',
        category: '数组/哈希',
        difficulty: 'Easy',
        questionType: 'single',
    },
    {
        id: 'two-sum-2',
        question: 'Two Sum 的最优时间复杂度是多少？',
        options: [
            { id: 'a', text: 'O(n^2)', isCorrect: false },
            { id: 'b', text: 'O(n log n)', isCorrect: false },
            { id: 'c', text: 'O(n)', isCorrect: true },
            { id: 'd', text: 'O(log n)', isCorrect: false },
        ],
        rationale: '哈希表一次遍历即可找到结果，时间复杂度 O(n)，空间复杂度 O(n)。',
        hint: '是否能做到单次遍历？',
        category: '复杂度分析',
        difficulty: 'Easy',
        questionType: 'single',
    },
    {
        id: 'sliding-window-1',
        question: '求最短子数组长度满足和 >= target，常用的解法是？',
        options: [
            { id: 'a', text: '滑动窗口', isCorrect: true },
            { id: 'b', text: '深度优先搜索', isCorrect: false },
            { id: 'c', text: '动态规划', isCorrect: false },
            { id: 'd', text: '拓扑排序', isCorrect: false },
        ],
        rationale: '双指针维护区间和，右指针扩展，左指针收缩以获得最短长度。',
        hint: '区间可扩可缩，用双指针控制。',
        category: '滑动窗口',
        difficulty: 'Medium',
        questionType: 'single',
    },
];
