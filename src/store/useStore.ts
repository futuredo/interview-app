import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, UserState, QuestionBankFilters } from '../types';
import questionsData from '../data/questions.json';

const normalizeQuestion = (question: Question): Question => ({
    ...question,
    tags: [...question.tags],
});

const createInitialQuestionBank = (): Question[] =>
    (questionsData as unknown as Question[]).map((item) => normalizeQuestion(item));

const defaultQuestionBankFilters: QuestionBankFilters = {
    searchTerm: '',
    selectedTag: null,
    sortOrder: 'default',
};

export const useStore = create<UserState>()(
    persist(
        (set) => ({
            completedQuestions: [],
            favorites: [],
            wrongQuestions: [],
            wrongQuestionCounts: {},
            practiceCounts: {},
            starRatings: {},
            dailyCheckins: [],
            dailyGoal: {
                questionsPerDay: 10,
                reminderEnabled: false,
            },
            userNotes: {},
            theme: 'light',
            challengeConfig: {
                questionCount: 5,
                difficulty: 'All',
                totalTimeLimit: 0,
                perQuestionTimeLimit: 0,
                questionSource: 'all',
                orderMode: 'random',
            },
            messageBoard: [],
            adminAnswerOverrides: {},
            questionBank: createInitialQuestionBank(),
            questionBankFilters: defaultQuestionBankFilters,
            profile: {
                nickname: '访客',
                avatarUrl: '',
            },
            userLogs: [],
            checkInRecords: [],
            checkInTime: '21:00',
            authUser: undefined,

            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'light' ? 'dark' : 'light',
                })),

            toggleFavorite: (id) =>
                set((state) => ({
                    favorites: state.favorites.includes(id)
                        // ...
                        ? state.favorites.filter((fid) => fid !== id)
                        : [...state.favorites, id],
                })),

            toggleWrong: (id) =>
                set((state) => ({
                    wrongQuestions: state.wrongQuestions.includes(id)
                        ? state.wrongQuestions.filter((wid) => wid !== id)
                        : [...state.wrongQuestions, id],
                    wrongQuestionCounts: state.wrongQuestions.includes(id)
                        ? state.wrongQuestionCounts
                        : {
                            ...state.wrongQuestionCounts,
                            [id]: (state.wrongQuestionCounts[id] || 0) + 1,
                        },
                })),

            markAsWrong: (id) =>
                set((state) => ({
                    wrongQuestions: state.wrongQuestions.includes(id)
                        ? state.wrongQuestions
                        : [...state.wrongQuestions, id],
                    wrongQuestionCounts: {
                        ...state.wrongQuestionCounts,
                        [id]: (state.wrongQuestionCounts[id] || 0) + 1,
                    },
                })),

            removeFromWrong: (id) =>
                set((state) => ({
                    wrongQuestions: state.wrongQuestions.filter((wid) => wid !== id),
                })),

            clearWrongQuestions: () =>
                set(() => ({
                    wrongQuestions: [],
                    wrongQuestionCounts: {},
                })),

            completeQuestion: (id) =>
                set((state) => ({
                    completedQuestions: state.completedQuestions.includes(id)
                        ? state.completedQuestions
                        : [...state.completedQuestions, id],
                })),

            incrementPracticeCount: (id) =>
                set((state) => ({
                    practiceCounts: {
                        ...state.practiceCounts,
                        [id]: (state.practiceCounts[id] || 0) + 1,
                    },
                })),

            resetPracticeCount: (id) =>
                set((state) => {
                    const next = { ...state.practiceCounts };
                    delete next[id];
                    return { practiceCounts: next };
                }),

            setRating: (id, rating) =>
                set((state) => ({
                    starRatings: { ...state.starRatings, [id]: rating },
                })),

            checkIn: () =>
                set((state) => {
                    const today = new Date().toISOString().split('T')[0];
                    if (state.dailyCheckins.includes(today)) return state;
                    return { dailyCheckins: [...state.dailyCheckins, today] };
                }),

            addCheckInRecord: (record) =>
                set((state) => {
                    const updatedRecords = [...state.checkInRecords, record];
                    const updatedCheckins = state.dailyCheckins.includes(record.date)
                        ? state.dailyCheckins
                        : [...state.dailyCheckins, record.date];
                    return {
                        checkInRecords: updatedRecords,
                        dailyCheckins: updatedCheckins,
                    };
                }),

            setCheckInTime: (time) =>
                set(() => ({
                    checkInTime: time,
                })),

            setDailyGoal: (goal) =>
                set(() => ({
                    dailyGoal: goal,
                })),

            saveUserNote: (questionId, answer) =>
                set((state) => ({
                    userNotes: { ...state.userNotes, [questionId]: answer },
                })),

            setChallengeConfig: (config) =>
                set(() => ({
                    challengeConfig: config,
                })),

            addMessage: (contact, content) =>
                set((state) => ({
                    messageBoard: [
                        {
                            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                            contact,
                            content,
                            createdAt: new Date().toISOString(),
                        },
                        ...state.messageBoard,
                    ],
                })),

            setMessageBoard: (messages) =>
                set(() => ({
                    messageBoard: messages,
                })),

            removeMessage: (id) =>
                set((state) => ({
                    messageBoard: state.messageBoard.filter((item) => item.id !== id),
                })),

            clearMessages: () =>
                set(() => ({
                    messageBoard: [],
                })),

            setProfile: (profile) =>
                set(() => ({
                    profile,
                })),

            setAdminAnswer: (id, content) =>
                set((state) => {
                    const next = { ...state.adminAnswerOverrides };
                    if (!content.trim()) {
                        delete next[id];
                    } else {
                        next[id] = content;
                    }
                    return {
                        adminAnswerOverrides: next,
                    };
                }),
            setQuestionBank: (questions) =>
                set(() => ({
                    questionBank: questions.map((question) => normalizeQuestion(question)),
                })),
            setQuestionBankFilters: (filters) =>
                set((state) => ({
                    questionBankFilters: {
                        ...state.questionBankFilters,
                        ...filters,
                    },
                })),
            resetQuestionBankFilters: () =>
                set(() => ({
                    questionBankFilters: defaultQuestionBankFilters,
                })),
            addQuestion: (question) =>
                set((state) => ({
                    questionBank: [normalizeQuestion(question), ...state.questionBank],
                })),
            updateQuestion: (id, updates) =>
                set((state) => ({
                    questionBank: state.questionBank.map((question) =>
                        question.id === id
                            ? normalizeQuestion({ ...question, ...updates, tags: updates.tags ?? question.tags })
                            : question
                    ),
                })),
            deleteQuestion: (id) =>
                set((state) => {
                    const restWrongCounts = { ...state.wrongQuestionCounts };
                    delete restWrongCounts[id];

                    const restPracticeCounts = { ...state.practiceCounts };
                    delete restPracticeCounts[id];

                    const restStarRatings = { ...state.starRatings };
                    delete restStarRatings[id];

                    const restUserNotes = { ...state.userNotes };
                    delete restUserNotes[id];

                    const restOverrides = { ...state.adminAnswerOverrides };
                    delete restOverrides[id];

                    return {
                        questionBank: state.questionBank.filter((question) => question.id !== id),
                        favorites: state.favorites.filter((fid) => fid !== id),
                        wrongQuestions: state.wrongQuestions.filter((wid) => wid !== id),
                        completedQuestions: state.completedQuestions.filter((cid) => cid !== id),
                        wrongQuestionCounts: restWrongCounts,
                        practiceCounts: restPracticeCounts,
                        starRatings: restStarRatings,
                        userNotes: restUserNotes,
                        adminAnswerOverrides: restOverrides,
                    };
                }),

            addUserLog: (content) =>
                set((state) => ({
                    userLogs: [
                        {
                            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                            content,
                            createdAt: new Date().toISOString(),
                        },
                        ...state.userLogs,
                    ],
                })),

            removeUserLog: (id) =>
                set((state) => ({
                    userLogs: state.userLogs.filter((log) => log.id !== id),
                })),

            clearFavorites: () =>
                set(() => ({
                    favorites: [],
                })),

            login: (name, role, username) =>
                set(() => ({
                    authUser: { name, role, username },
                })),

            logout: () =>
                set(() => ({
                    authUser: undefined,
                })),
        }),
        {
            name: 'unity-interview-storage',
            partialize: (state) => {
                const { messageBoard, ...rest } = state;
                return rest;
            },
        }
    )
);
