export interface Question {
    id: string;
    title: string;
    content: string;
    tags: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    originalLink?: string;
}

export interface ChallengeConfig {
    questionCount: 5 | 10 | 15 | 20;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'All';
    totalTimeLimit: number; // 秒数，0 表示无限制
    perQuestionTimeLimit: number; // 秒数，0 表示无限制
    questionSource: 'all' | 'favorites' | 'wrong';
    orderMode: 'random' | 'sequence';
}

export interface QuestionBankFilters {
    searchTerm: string;
    selectedTag: string | null;
    sortOrder: 'default' | 'asc' | 'desc';
}

export interface UserLog {
    id: string;
    content: string;
    createdAt: string;
}

export interface MessageBoardItem {
    id: string;
    contact: string;
    content: string;
    createdAt: string;
}

export interface ChangelogItem {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

export interface FeatureRequestItem {
    id: string;
    title: string;
    content: string;
    contact: string;
    status: 'open' | 'planned' | 'done';
    createdAt: string;
}

export interface DiscussionItem {
    id: string;
    topic: string;
    content: string;
    contact: string;
    createdAt: string;
}

export interface AuthUser {
    name: string;
    role: 'user' | 'admin';
    username: string;
}

export interface UserProfile {
    nickname: string;
    avatarUrl: string;
}

export interface CheckInRecord {
    date: string;
    time: string;
}

export interface QuestionResult {
    questionId: string;
    question: Question;
    mastered: boolean;
    userAnswer?: string;
}

export interface ChallengeResult {
    config: ChallengeConfig;
    questions: QuestionResult[];
    correctCount: number;
    totalTime: number; // 用时（秒）
    completedAt: string; // ISO 时间字符串
}

export interface DailyGoal {
    questionsPerDay: number;
    reminderEnabled: boolean;
}

export interface UserNote {
    questionId: string;
    answer: string;
    updatedAt: string;
}

export interface UserState {
    completedQuestions: string[];
    favorites: string[];
    wrongQuestions: string[];
    wrongQuestionCounts: Record<string, number>; // questionId -> times added to wrong book
    practiceCounts: Record<string, number>; // questionId -> practice times
    starRatings: Record<string, number>; // questionId -> rating
    dailyCheckins: string[]; // ISO date strings
    dailyGoal: DailyGoal;
    userNotes: Record<string, string>; // questionId -> user answer
    theme: 'light' | 'dark';
    challengeConfig: ChallengeConfig;
    messageBoard: MessageBoardItem[];
    adminAnswerOverrides: Record<string, string>;
    questionBank: Question[];
    questionBankFilters: QuestionBankFilters;
    profile: UserProfile;
    userLogs: UserLog[];
    authUser?: AuthUser;
    checkInRecords: CheckInRecord[];
    checkInTime: string;

    toggleFavorite: (id: string) => void;
    toggleWrong: (id: string) => void;
    markAsWrong: (id: string) => void;
    removeFromWrong: (id: string) => void;
    clearWrongQuestions: () => void;
    completeQuestion: (id: string) => void;
    incrementPracticeCount: (id: string) => void;
    resetPracticeCount: (id: string) => void;
    setRating: (id: string, rating: number) => void;
    checkIn: () => void;
    addCheckInRecord: (record: CheckInRecord) => void;
    setCheckInTime: (time: string) => void;
    setDailyGoal: (goal: DailyGoal) => void;
    saveUserNote: (questionId: string, answer: string) => void;
    setChallengeConfig: (config: ChallengeConfig) => void;
    addMessage: (contact: string, content: string) => void;
    setMessageBoard: (messages: MessageBoardItem[]) => void;
    removeMessage: (id: string) => void;
    clearMessages: () => void;
    setProfile: (profile: UserProfile) => void;
    setAdminAnswer: (id: string, content: string) => void;
    setQuestionBank: (questions: Question[]) => void;
    setQuestionBankFilters: (filters: Partial<QuestionBankFilters>) => void;
    resetQuestionBankFilters: () => void;
    addQuestion: (question: Question) => void;
    updateQuestion: (id: string, updates: Partial<Question>) => void;
    deleteQuestion: (id: string) => void;
    addUserLog: (content: string) => void;
    removeUserLog: (id: string) => void;
    clearFavorites: () => void;
    toggleTheme: () => void;
    login: (name: string, role: 'user' | 'admin', username: string) => void;
    logout: () => void;
}
