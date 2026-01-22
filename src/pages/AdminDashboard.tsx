import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
    Shield,
    Trash2,
    MessageSquare,
    Search,
    Filter,
    BookOpen,
    Edit3,
    Save,
    Undo2,
    ExternalLink,
    PlusCircle,
    X,
} from 'lucide-react';
import type { Question } from '../types';
import { parseContentWithCode } from '../utils/parseContentWithCode';
import { extractQuestionSection } from '../utils/questionContent';

export const AdminDashboard: React.FC = () => {
    const {
        messageBoard,
        removeMessage,
        clearMessages,
        adminAnswerOverrides,
        setAdminAnswer,
        questionBank,
        addQuestion,
        updateQuestion,
        deleteQuestion,
    } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(questionBank[0]?.id ?? null);
    const [overrideDrafts, setOverrideDrafts] = useState<Record<string, string>>({});
    const [previewMode, setPreviewMode] = useState<'override' | 'original'>('override');
    const [editForm, setEditForm] = useState({
        id: '',
        title: '',
        tagsInput: '',
        difficulty: 'Medium' as Question['difficulty'] | 'Easy' | 'Medium' | 'Hard',
        content: '',
        originalLink: '',
    });
    const [isEditingExisting, setIsEditingExisting] = useState(false);
    const [savingQuestion, setSavingQuestion] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const overrideCount = Object.keys(adminAnswerOverrides).length;

    const filteredQuestions = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return questionBank.filter((q) => {
            if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false;
            if (!term) return true;
            const plainContent = q.content.toLowerCase();
            return (
                q.title.toLowerCase().includes(term) ||
                q.tags.some((tag) => tag.toLowerCase().includes(term)) ||
                plainContent.includes(term)
            );
        });
    }, [difficultyFilter, questionBank, searchTerm]);

    const effectiveSelectedQuestionId = useMemo(() => {
        if (selectedQuestionId && filteredQuestions.some((q) => q.id === selectedQuestionId)) {
            return selectedQuestionId;
        }
        return filteredQuestions[0]?.id ?? null;
    }, [filteredQuestions, selectedQuestionId]);

    const selectedQuestion = useMemo(() => {
        return questionBank.find((q) => q.id === effectiveSelectedQuestionId) ?? null;
    }, [effectiveSelectedQuestionId, questionBank]);

    const currentDraft = useMemo(() => {
        if (!selectedQuestion) return '';
        return (
            overrideDrafts[selectedQuestion.id] ??
            adminAnswerOverrides[selectedQuestion.id] ??
            selectedQuestion.content
        );
    }, [selectedQuestion, overrideDrafts, adminAnswerOverrides]);

    const baselineContent = selectedQuestion
        ? adminAnswerOverrides[selectedQuestion.id] || selectedQuestion.content
        : '';
    const isDirty = selectedQuestion ? currentDraft !== baselineContent : false;

    const resetForm = () => {
        setEditForm({
            id: '',
            title: '',
            tagsInput: '',
            difficulty: 'Medium',
            content: '',
            originalLink: '',
        });
        setIsEditingExisting(false);
    };

    const handleStartCreate = () => {
        resetForm();
    };

    const handleEditQuestion = (q: Question) => {
        setEditForm({
            id: q.id,
            title: q.title,
            tagsInput: q.tags.join(', '),
            difficulty: q.difficulty,
            content: q.content,
            originalLink: q.originalLink ?? '',
        });
        setIsEditingExisting(true);
    };

    const handleSaveQuestion = () => {
        const { id, title, tagsInput, difficulty, content, originalLink } = editForm;
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();
        if (!trimmedTitle || !trimmedContent) return;
        setSavingQuestion(true);
        const tags = tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
        if (isEditingExisting && id) {
            updateQuestion(id, {
                title: trimmedTitle,
                tags,
                difficulty: difficulty as Question['difficulty'],
                content: trimmedContent,
                originalLink: originalLink.trim(),
            });
            setSelectedQuestionId(id);
        } else {
            const newId = `q-${Date.now()}`;
            addQuestion({
                id: newId,
                title: trimmedTitle,
                tags,
                difficulty: difficulty as Question['difficulty'],
                content: trimmedContent,
                originalLink: originalLink.trim() || undefined,
            });
            setSelectedQuestionId(newId);
        }
        setSavingQuestion(false);
        resetForm();
    };

    const handleDeleteQuestion = (id: string) => {
        const nextId = questionBank.find((q) => q.id !== id)?.id ?? null;
        deleteQuestion(id);
        if (selectedQuestionId === id) {
            setSelectedQuestionId(nextId);
        }
        setDeleteConfirmId(null);
    };

    const handleDraftChange = (value: string) => {
        if (!selectedQuestion) return;
        setOverrideDrafts((prev) => ({ ...prev, [selectedQuestion.id]: value }));
    };

    const handleSaveOverride = () => {
        if (!selectedQuestion || !currentDraft.trim()) return;
        setAdminAnswer(selectedQuestion.id, currentDraft);
    };

    const handleResetOverride = () => {
        if (!selectedQuestion) return;
        setAdminAnswer(selectedQuestion.id, '');
        setOverrideDrafts((prev) => {
            const next = { ...prev };
            delete next[selectedQuestion.id];
            return next;
        });
    };

    const renderPreview = () => {
        if (!selectedQuestion) return null;
        const previewContent = previewMode === 'override' ? currentDraft : selectedQuestion.content;
        return (
            <div className="prose dark:prose-invert max-w-none text-[var(--color-text-main)]">
                {parseContentWithCode(previewContent)}
            </div>
        );
    };

    const questionSnippet = (content: string) => {
        const plain = extractQuestionSection(content)
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return plain.slice(0, 80) + (plain.length > 80 ? '…' : '');
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-main)]">管理员控制台</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">管理留言板与题库，实时覆盖答案</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="surface-card p-5 flex flex-col gap-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">留言数量</span>
                    <strong className="text-3xl text-[var(--color-text-main)]">{messageBoard.length}</strong>
                    <span className="text-xs text-[var(--color-text-secondary)]">最近 30 天内全部用户提交</span>
                </div>
                <div className="surface-card p-5 flex flex-col gap-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">题库总量</span>
                    <strong className="text-3xl text-[var(--color-text-main)]">{questionBank.length}</strong>
                    <span className="text-xs text-[var(--color-text-secondary)]">含 Easy / Medium / Hard 全部难度</span>
                </div>
                <div className="surface-card p-5 flex flex-col gap-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">已覆盖答案</span>
                    <strong className="text-3xl text-[var(--color-text-main)]">{overrideCount}</strong>
                    <span className="text-xs text-[var(--color-text-secondary)]">覆盖内容会在练习与闯关中展示</span>
                </div>
                <div className="surface-card p-5 flex flex-col gap-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">操作</span>
                    <button
                        onClick={handleStartCreate}
                        className="btn-primary px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" /> 新增题目
                    </button>
                    <span className="text-xs text-[var(--color-text-secondary)]">支持新增 / 编辑 / 删除</span>
                </div>
            </div>

            <div className="surface-card p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                        <MessageSquare className="w-4 h-4" />
                        当前留言 {messageBoard.length} 条
                    </div>
                    {messageBoard.length > 0 && (
                        <button
                            onClick={clearMessages}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                        >
                            <Trash2 className="w-4 h-4" />
                            清空全部
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                    {messageBoard.length === 0 ? (
                        <div className="text-sm text-[var(--color-text-secondary)]">暂无留言</div>
                    ) : (
                        messageBoard.map((item) => (
                            <div key={item.id} className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-bg)]/40">
                                <div className="text-xs text-[var(--color-text-secondary)] flex items-center justify-between">
                                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                                    <button
                                        onClick={() => removeMessage(item.id)}
                                        className="text-red-500 hover:text-red-600 text-xs"
                                    >
                                        删除
                                    </button>
                                </div>
                                <div className="mt-2 font-semibold text-[var(--color-text-main)]">{item.contact}</div>
                                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{item.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {deleteConfirmId && (
                <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <div className="text-sm">确认删除该题目？删除后无法恢复。</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleDeleteQuestion(deleteConfirmId)}
                            className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm"
                        >
                            确认删除
                        </button>
                        <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-sm text-red-700"
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="surface-card p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-semibold text-[var(--color-text-main)]">题库筛选</h2>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="按题目 / 标签 / 内容搜索"
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value as 'All' | 'Easy' | 'Medium' | 'Hard')}
                            className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
                        >
                            <option value="All">全部难度</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div className="text-xs text-[var(--color-text-secondary)] flex items-center justify-between gap-2">
                        <span>{filteredQuestions.length} 条结果</span>
                        <button
                            onClick={() => setSelectedQuestionId(filteredQuestions[0]?.id ?? null)}
                            className="text-[var(--color-primary)] text-xs hover:underline"
                        >
                            跳到首条
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-4 max-h-[70vh] bg-[var(--color-surface)] rounded-xl">
                        {filteredQuestions.map((question) => {
                            const isSelected = question.id === effectiveSelectedQuestionId;
                            const hasOverride = Boolean(adminAnswerOverrides[question.id]);
                            return (
                                <button
                                    key={question.id}
                                    onClick={() => setSelectedQuestionId(question.id)}
                                    className={`w-full text-left border rounded-xl p-3 flex flex-col gap-2 transition-all ${
                                        isSelected
                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm'
                                            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                                    }`}
                                > 
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold text-[var(--color-text-main)] line-clamp-1">
                                            {question.title}
                                        </span>
                                        {hasOverride && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                                已覆盖
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                                        <span className="px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                                            {question.difficulty}
                                        </span>
                                        <span className="line-clamp-1">{question.tags.slice(0, 2).join(' / ')}</span>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                                        {questionSnippet(question.content)}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditQuestion(question);
                                            }}
                                            className="underline hover:text-[var(--color-primary)]"
                                        >
                                            编辑
                                        </button>
                                        <span className="text-[var(--color-border)]">|</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirmId(question.id);
                                            }}
                                            className="underline hover:text-red-500"
                                        >
                                            删除
                                        </button>
                                        {question.originalLink && (
                                            <>
                                                <span className="text-[var(--color-border)]">|</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(question.originalLink || '#', '_blank');
                                                    }}
                                                    className="text-[var(--color-primary)] underline"
                                                >
                                                    原文
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="surface-card p-6 lg:col-span-2 flex flex-col gap-6 min-h-[600px]">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
                        <div className="surface-card border border-dashed border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4 rounded-xl flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Edit3 className="w-4 h-4 text-[var(--color-primary)]" />
                                    <span className="text-sm font-semibold text-[var(--color-text-main)]">{isEditingExisting ? '编辑题目' : '新增题目'}</span>
                                </div>
                                {isEditingExisting && (
                                    <button
                                        onClick={resetForm}
                                        className="text-xs text-[var(--color-text-secondary)] inline-flex items-center gap-1 hover:text-[var(--color-primary)]"
                                    >
                                        <X className="w-3 h-3" /> 取消编辑
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[var(--color-text-secondary)]">标题</label>
                                    <input
                                        value={editForm.title}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                                        className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                                        placeholder="例如：101. 渲染管线基础"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[var(--color-text-secondary)]">难度</label>
                                    <select
                                        value={editForm.difficulty}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, difficulty: e.target.value as Question['difficulty'] }))}
                                        className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[var(--color-text-secondary)]">标签（逗号分隔）</label>
                                <input
                                    value={editForm.tagsInput}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, tagsInput: e.target.value }))}
                                    className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                                    placeholder="图形学, 渲染, Unity"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[var(--color-text-secondary)]">原文链接（可选）</label>
                                <input
                                    value={editForm.originalLink}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, originalLink: e.target.value }))}
                                    className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[var(--color-text-secondary)]">题干与答案（支持 HTML / Markdown）</label>
                                <textarea
                                    value={editForm.content}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                                    className="w-full min-h-[180px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] p-3 text-sm"
                                    placeholder="包含题干和参考答案"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSaveQuestion}
                                    disabled={savingQuestion || !editForm.title.trim() || !editForm.content.trim()}
                                    className={`btn-primary px-4 py-2 rounded-lg text-sm ${savingQuestion ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <Save className="w-4 h-4" /> {isEditingExisting ? '保存修改' : '保存新题'}
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                                >
                                    重置
                                </button>
                            </div>
                        </div>

                        <div className="surface-card border border-dashed border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4 rounded-xl text-sm text-[var(--color-text-secondary)]">
                            <h4 className="text-[var(--color-text-main)] font-semibold mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> 提示
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>标签请用逗号分隔，例如：图形学, 渲染, Unity。</li>
                                <li>删除题目会同步移除收藏、错题、完成记录等关联状态。</li>
                                <li>覆盖答案仅影响练习/闯关展示，不会更改原题内容。</li>
                            </ul>
                        </div>
                    </div>

                    {!selectedQuestion ? (
                        <div className="text-[var(--color-text-secondary)]">请选择左侧题目</div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--color-text-main)]">{selectedQuestion.title}</h2>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="px-3 py-0.5 rounded-full border border-[var(--color-border)] text-sm">
                                                {selectedQuestion.difficulty}
                                            </span>
                                            {selectedQuestion.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-xs border border-[var(--color-border)]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <Link
                                        to={`/question/${selectedQuestion.id}`}
                                        target="_blank"
                                        className="flex items-center gap-1 text-sm text-[var(--color-primary)]"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        前往练习页
                                    </Link>
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {questionSnippet(selectedQuestion.content)}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                                        <Edit3 className="w-4 h-4" />
                                        编辑覆盖答案（支持 HTML / Markdown）
                                    </label>
                                    <textarea
                                        value={currentDraft}
                                        onChange={(e) => handleDraftChange(e.target.value)}
                                        className="w-full min-h-[260px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] p-4 text-sm"
                                    />
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <button
                                            onClick={handleSaveOverride}
                                            disabled={!isDirty || !currentDraft.trim()}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                                                !isDirty || !currentDraft.trim()
                                                    ? 'bg-[var(--color-border)] text-[var(--color-text-secondary)] cursor-not-allowed'
                                                    : 'btn-primary'
                                            }`}
                                        >
                                            <Save className="w-4 h-4" />
                                            保存覆盖内容
                                        </button>
                                        <button
                                            onClick={handleResetOverride}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]"
                                        >
                                            <Undo2 className="w-4 h-4" />
                                            恢复原文
                                        </button>
                                        <div className="text-xs text-[var(--color-text-secondary)]">
                                            已覆盖：{adminAnswerOverrides[selectedQuestion.id] ? '是' : '否'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--color-text-secondary)]">预览</span>
                                        <div className="inline-flex rounded-full border border-[var(--color-border)] overflow-hidden">
                                            <button
                                                onClick={() => setPreviewMode('override')}
                                                className={`px-4 py-1 text-xs ${
                                                    previewMode === 'override'
                                                        ? 'bg-[var(--color-primary)] text-white'
                                                        : 'text-[var(--color-text-secondary)]'
                                                }`}
                                            >
                                                覆盖内容
                                            </button>
                                            <button
                                                onClick={() => setPreviewMode('original')}
                                                className={`px-4 py-1 text-xs ${
                                                    previewMode === 'original'
                                                        ? 'bg-[var(--color-primary)] text-white'
                                                        : 'text-[var(--color-text-secondary)]'
                                                }`}
                                            >
                                                原题答案
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border border-[var(--color-border)] rounded-xl p-4 max-h-[360px] overflow-y-auto bg-[var(--color-bg)]/40">
                                        {renderPreview()}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
