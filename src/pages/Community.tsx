import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Send, ClipboardList, Users, RefreshCw, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
    addDiscussion,
    addFeatureRequest,
    addMessageRemote,
    fetchDiscussions,
    fetchFeatureRequests,
    fetchMessages,
    removeDiscussion,
    removeFeatureRequest,
} from '../utils/supabaseApi';

export const Community: React.FC = () => {
    const { authUser, messageBoard, setMessageBoard } = useStore();
    const isSuperAdmin = authUser?.username === '1561473324';

    const [contact, setContact] = useState('');
    const [messageDraft, setMessageDraft] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [featureTitle, setFeatureTitle] = useState('');
    const [featureContent, setFeatureContent] = useState('');
    const [featureContact, setFeatureContact] = useState('');
    const [featureRequests, setFeatureRequests] = useState<Array<{ id: string; title: string; content: string; contact: string; status: 'open' | 'planned' | 'done'; createdAt: string }>>([]);
    const [loadingFeatures, setLoadingFeatures] = useState(false);

    const [discussionTopic, setDiscussionTopic] = useState('');
    const [discussionContent, setDiscussionContent] = useState('');
    const [discussionContact, setDiscussionContact] = useState('');
    const [discussions, setDiscussions] = useState<Array<{ id: string; topic: string; content: string; contact: string; createdAt: string }>>([]);
    const [loadingDiscussions, setLoadingDiscussions] = useState(false);

    const boardList = useMemo(() => messageBoard.slice(0, 50), [messageBoard]);

    const loadAll = async () => {
        setLoadingMessages(true);
        setLoadingFeatures(true);
        setLoadingDiscussions(true);
        const [messages, features, discussionData] = await Promise.all([
            fetchMessages(),
            fetchFeatureRequests(),
            fetchDiscussions(),
        ]);
        setMessageBoard(messages);
        setFeatureRequests(features);
        setDiscussions(discussionData);
        setLoadingMessages(false);
        setLoadingFeatures(false);
        setLoadingDiscussions(false);
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleAddMessage = async () => {
        const trimmedContact = contact.trim();
        const trimmedMessage = messageDraft.trim();
        if (!trimmedContact || !trimmedMessage) return;
        await addMessageRemote(trimmedContact, trimmedMessage);
        const messages = await fetchMessages();
        setMessageBoard(messages);
        setContact('');
        setMessageDraft('');
    };

    const handleAddFeature = async () => {
        const title = featureTitle.trim();
        const content = featureContent.trim();
        const contactValue = featureContact.trim();
        if (!title || !content || !contactValue) return;
        await addFeatureRequest(title, content, contactValue);
        const features = await fetchFeatureRequests();
        setFeatureRequests(features);
        setFeatureTitle('');
        setFeatureContent('');
        setFeatureContact('');
    };

    const handleAddDiscussion = async () => {
        const topic = discussionTopic.trim();
        const content = discussionContent.trim();
        const contactValue = discussionContact.trim();
        if (!topic || !content || !contactValue) return;
        await addDiscussion(topic, content, contactValue);
        const items = await fetchDiscussions();
        setDiscussions(items);
        setDiscussionTopic('');
        setDiscussionContent('');
        setDiscussionContact('');
    };

    const handleRemoveFeature = async (id: string) => {
        if (!isSuperAdmin) return;
        await removeFeatureRequest(id);
        const features = await fetchFeatureRequests();
        setFeatureRequests(features);
    };

    const handleRemoveDiscussion = async (id: string) => {
        if (!isSuperAdmin) return;
        await removeDiscussion(id);
        const items = await fetchDiscussions();
        setDiscussions(items);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-main)]">社区留言与讨论</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">所有账号都可发言，超级管理员可维护内容</p>
                </div>
                <button
                    onClick={loadAll}
                    className="btn-secondary flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> 刷新
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="surface-card p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-semibold text-[var(--color-text-main)]">留言墙</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="联系方式"
                            className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        />
                        <textarea
                            value={messageDraft}
                            onChange={(e) => setMessageDraft(e.target.value)}
                            placeholder="写下你的留言"
                            className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] min-h-[120px]"
                        />
                        <button onClick={handleAddMessage} className="btn-primary flex items-center gap-2 w-fit">
                            <Send className="w-4 h-4" /> 发布留言
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                        {loadingMessages ? (
                            <div className="text-sm text-[var(--color-text-secondary)]">留言加载中...</div>
                        ) : boardList.length === 0 ? (
                            <div className="text-sm text-[var(--color-text-secondary)]">暂无留言</div>
                        ) : (
                            boardList.map((item, index) => (
                                <div key={item.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4">
                                    <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                                        {index === 0 && <span className="text-[var(--color-primary)]">最新</span>}
                                    </div>
                                    <div className="mt-2 font-semibold text-[var(--color-text-main)]">{item.contact}</div>
                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">{item.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="surface-card p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-semibold text-[var(--color-text-main)]">站主需求区</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            value={featureTitle}
                            onChange={(e) => setFeatureTitle(e.target.value)}
                            placeholder="需求标题"
                            className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        />
                        <textarea
                            value={featureContent}
                            onChange={(e) => setFeatureContent(e.target.value)}
                            placeholder="描述你希望站主支持的功能"
                            className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] min-h-[120px]"
                        />
                        <input
                            value={featureContact}
                            onChange={(e) => setFeatureContact(e.target.value)}
                            placeholder="联系方式"
                            className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                        />
                        <button onClick={handleAddFeature} className="btn-primary flex items-center gap-2 w-fit">
                            <Send className="w-4 h-4" /> 提交需求
                        </button>
                    </div>
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                        {loadingFeatures ? (
                            <div className="text-sm text-[var(--color-text-secondary)]">需求加载中...</div>
                        ) : featureRequests.length === 0 ? (
                            <div className="text-sm text-[var(--color-text-secondary)]">暂无需求</div>
                        ) : (
                            featureRequests.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4">
                                    <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                                                {item.status === 'open' ? '待评估' : item.status === 'planned' ? '计划中' : '已完成'}
                                            </span>
                                            {isSuperAdmin && (
                                                <button
                                                    onClick={() => handleRemoveFeature(item.id)}
                                                    className="text-red-500"
                                                >
                                                    删除
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 font-semibold text-[var(--color-text-main)]">{item.title}</div>
                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 whitespace-pre-wrap">{item.content}</p>
                                    <p className="text-xs text-[var(--color-text-secondary)] mt-2">联系：{item.contact}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="surface-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <h2 className="text-xl font-semibold text-[var(--color-text-main)]">讨论区</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <input
                        value={discussionTopic}
                        onChange={(e) => setDiscussionTopic(e.target.value)}
                        placeholder="讨论话题"
                        className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                    />
                    <input
                        value={discussionContact}
                        onChange={(e) => setDiscussionContact(e.target.value)}
                        placeholder="联系方式 / 昵称"
                        className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
                    />
                    <button onClick={handleAddDiscussion} className="btn-primary flex items-center gap-2 justify-center">
                        <Send className="w-4 h-4" /> 发起讨论
                    </button>
                </div>
                <textarea
                    value={discussionContent}
                    onChange={(e) => setDiscussionContent(e.target.value)}
                    placeholder="写下你的观点或问题"
                    className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] min-h-[120px]"
                />

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {loadingDiscussions ? (
                        <div className="text-sm text-[var(--color-text-secondary)]">讨论加载中...</div>
                    ) : discussions.length === 0 ? (
                        <div className="text-sm text-[var(--color-text-secondary)]">暂无讨论</div>
                    ) : (
                        discussions.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4">
                                <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                                    {isSuperAdmin && (
                                        <button
                                            onClick={() => handleRemoveDiscussion(item.id)}
                                            className="text-red-500"
                                        >
                                            删除
                                        </button>
                                    )}
                                </div>
                                <div className="mt-2 font-semibold text-[var(--color-text-main)]">{item.topic}</div>
                                <p className="text-sm text-[var(--color-text-secondary)] mt-1 whitespace-pre-wrap">{item.content}</p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-2">发起人：{item.contact}</p>
                            </div>
                        ))
                    )}
                </div>

                {isSuperAdmin && (
                    <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
                        <Shield className="w-4 h-4" /> 超级管理员可删除内容进行维护
                    </div>
                )}
            </div>
        </div>
    );
};
