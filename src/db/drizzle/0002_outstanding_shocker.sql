-- Enable RLS only on public.assets and public.influencers (no policies)

-- influencers
alter table if exists public.influencers enable row level security;

-- assets
alter table if exists public.assets enable row level security;

-- Custom SQL migration file, put your code below! --