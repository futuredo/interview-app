# Supabase 数据表与策略

我无法代你在 Supabase 后台操作（需要你的账号权限），但你可以按下面步骤自行完成。

## 操作步骤
1. 登录 Supabase 控制台，进入项目。
2. 打开左侧 SQL Editor。
3. 粘贴并执行下方 SQL。
4. 执行成功后，在 Table Editor 中确认 messages / changelog / pageviews / feature_requests / discussions / discussion_replies / user_profiles 已创建。
5. 在 Project Settings → API 中确认 anon key 与项目 URL，确保已写入本项目 .env。

## SQL（建表 + RLS 策略）
请在 Supabase SQL Editor 运行以下 SQL，创建留言、升级日志与浏览统计表。

```sql
-- 留言表
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  contact text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 升级日志表
create table if not exists changelog (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 浏览统计表
create table if not exists pageviews (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  created_at timestamptz not null default now()
);

-- 站主需求表
create table if not exists feature_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  contact text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

-- 讨论区表
create table if not exists discussions (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content text not null,
  contact text not null,
  created_at timestamptz not null default now()
);

-- 讨论区回复表
create table if not exists discussion_replies (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references discussions(id) on delete cascade,
  nickname text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 用户资料表（用于超级管理员云端资料同步）
create table if not exists user_profiles (
  username text primary key,
  nickname text not null,
  avatar_url text,
  updated_at timestamptz not null default now()
);

-- 开放读写（匿名 key 可用）。如需更严格的权限，请改用 auth 用户策略。
alter table messages enable row level security;
create policy "public read messages" on messages for select using (true);
create policy "public write messages" on messages for insert with check (true);
create policy "public update messages" on messages for update using (true) with check (true);
create policy "public delete messages" on messages for delete using (true);

alter table changelog enable row level security;
create policy "public read changelog" on changelog for select using (true);
create policy "public write changelog" on changelog for insert with check (true);
create policy "public update changelog" on changelog for update using (true) with check (true);
create policy "public delete changelog" on changelog for delete using (true);

alter table pageviews enable row level security;
create policy "public read pageviews" on pageviews for select using (true);
create policy "public write pageviews" on pageviews for insert with check (true);

alter table feature_requests enable row level security;
create policy "public read feature_requests" on feature_requests for select using (true);
create policy "public write feature_requests" on feature_requests for insert with check (true);
create policy "public update feature_requests" on feature_requests for update using (true) with check (true);
create policy "public delete feature_requests" on feature_requests for delete using (true);

alter table discussions enable row level security;
create policy "public read discussions" on discussions for select using (true);
create policy "public write discussions" on discussions for insert with check (true);
create policy "public delete discussions" on discussions for delete using (true);

alter table discussion_replies enable row level security;
create policy "public read discussion_replies" on discussion_replies for select using (true);
create policy "public write discussion_replies" on discussion_replies for insert with check (true);

alter table user_profiles enable row level security;
create policy "public read user_profiles" on user_profiles for select using (true);
create policy "public upsert user_profiles" on user_profiles for insert with check (true);
create policy "public update user_profiles" on user_profiles for update using (true) with check (true);
```

说明：
- 目前使用 anon key，所以策略为公开读写，确保留言/日志/统计可用。
- 若要限制仅管理员可删改，请接入 Supabase Auth 并为管理员写权限策略。
