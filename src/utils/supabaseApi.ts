import { supabase } from './supabaseClient';
import type { MessageBoardItem, ChangelogItem, FeatureRequestItem, DiscussionItem } from '../types';

const mapMessage = (row: any): MessageBoardItem => ({
    id: row.id,
    contact: row.contact,
    content: row.content,
    createdAt: row.created_at,
});

const mapChangelog = (row: any): ChangelogItem => ({
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const mapFeatureRequest = (row: any): FeatureRequestItem => ({
    id: row.id,
    title: row.title,
    content: row.content,
    contact: row.contact,
    status: row.status,
    createdAt: row.created_at,
});

const mapDiscussion = (row: any): DiscussionItem => ({
    id: row.id,
    topic: row.topic,
    content: row.content,
    contact: row.contact,
    createdAt: row.created_at,
});

export const fetchMessages = async (): Promise<MessageBoardItem[]> => {
    const { data, error } = await supabase
        .from('messages')
        .select('id, contact, content, created_at')
        .order('created_at', { ascending: false })
        .limit(60);

    if (error) {
        console.error('加载留言失败', error);
        return [];
    }

    return (data ?? []).map(mapMessage);
};

export const addMessageRemote = async (contact: string, content: string) => {
    const { error } = await supabase.from('messages').insert({ contact, content });
    if (error) {
        console.error('新增留言失败', error);
        throw error;
    }
};

export const updateMessageRemote = async (id: string, contact: string, content: string) => {
    const { error } = await supabase
        .from('messages')
        .update({ contact, content })
        .eq('id', id);
    if (error) {
        console.error('更新留言失败', error);
        throw error;
    }
};

export const removeMessageRemote = async (id: string) => {
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('删除留言失败', error);
        throw error;
    }
};

export const clearMessagesRemote = async () => {
    const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', '');
    if (error) {
        console.error('清空留言失败', error);
        throw error;
    }
};

export const fetchChangelog = async (): Promise<ChangelogItem[]> => {
    const { data, error } = await supabase
        .from('changelog')
        .select('id, title, content, created_at, updated_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('加载升级日志失败', error);
        return [];
    }

    return (data ?? []).map(mapChangelog);
};

export const fetchFeatureRequests = async (): Promise<FeatureRequestItem[]> => {
    const { data, error } = await supabase
        .from('feature_requests')
        .select('id, title, content, contact, status, created_at')
        .order('created_at', { ascending: false })
        .limit(80);

    if (error) {
        console.error('加载需求失败', error);
        return [];
    }

    return (data ?? []).map(mapFeatureRequest);
};

export const addFeatureRequest = async (title: string, content: string, contact: string) => {
    const { error } = await supabase.from('feature_requests').insert({
        title,
        content,
        contact,
        status: 'open',
    });
    if (error) {
        console.error('新增需求失败', error);
        throw error;
    }
};

export const updateFeatureRequestStatus = async (id: string, status: 'open' | 'planned' | 'done') => {
    const { error } = await supabase
        .from('feature_requests')
        .update({ status })
        .eq('id', id);
    if (error) {
        console.error('更新需求状态失败', error);
        throw error;
    }
};

export const removeFeatureRequest = async (id: string) => {
    const { error } = await supabase
        .from('feature_requests')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('删除需求失败', error);
        throw error;
    }
};

export const fetchDiscussions = async (): Promise<DiscussionItem[]> => {
    const { data, error } = await supabase
        .from('discussions')
        .select('id, topic, content, contact, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('加载讨论失败', error);
        return [];
    }

    return (data ?? []).map(mapDiscussion);
};

export const addDiscussion = async (topic: string, content: string, contact: string) => {
    const { error } = await supabase.from('discussions').insert({
        topic,
        content,
        contact,
    });
    if (error) {
        console.error('新增讨论失败', error);
        throw error;
    }
};

export const removeDiscussion = async (id: string) => {
    const { error } = await supabase
        .from('discussions')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('删除讨论失败', error);
        throw error;
    }
};

export const seedChangelogIfEmpty = async () => {
    const { data, error } = await supabase
        .from('changelog')
        .select('id')
        .limit(1);

    if (error) {
        console.error('检测升级日志失败', error);
        return;
    }

    if ((data ?? []).length > 0) return;

    const { error: insertError } = await supabase.from('changelog').insert({
        title: '升级日志 · 2026-01-23',
        content: '支持多人留言，网络同步功能',
    });

    if (insertError) {
        console.error('写入默认升级日志失败', insertError);
    }
};

export const addChangelog = async (title: string, content: string) => {
    const { error } = await supabase.from('changelog').insert({ title, content });
    if (error) {
        console.error('新增升级日志失败', error);
        throw error;
    }
};

export const updateChangelog = async (id: string, title: string, content: string) => {
    const { error } = await supabase
        .from('changelog')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) {
        console.error('更新升级日志失败', error);
        throw error;
    }
};

export const removeChangelog = async (id: string) => {
    const { error } = await supabase
        .from('changelog')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('删除升级日志失败', error);
        throw error;
    }
};

export const trackPageView = async (path: string) => {
    if (!path) return;
    const { error } = await supabase.from('pageviews').insert({ path });
    if (error) {
        console.error('记录浏览量失败', error);
    }
};

export const fetchPageViews = async () => {
    const { data, error } = await supabase
        .from('pageviews')
        .select('path, created_at')
        .order('created_at', { ascending: false })
        .limit(500);

    if (error) {
        console.error('加载浏览数据失败', error);
        return { total: 0, today: 0, pathCounts: [] as Array<{ path: string; count: number }> };
    }

    const items = (data ?? []) as Array<{ path: string; created_at: string }>;
    const total = items.length;
    const today = items.filter((item) => {
        const date = new Date(item.created_at);
        const now = new Date();
        return date.toDateString() === now.toDateString();
    }).length;

    const countMap = items.reduce((acc: Record<string, number>, item) => {
        const key = item.path || '/';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const pathCounts = Object.entries(countMap)
        .map(([path, count]) => ({ path, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

    return { total, today, pathCounts };
};
