-- Fashion Point Jagraon product catalogue. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'customer' check (role in ('admin','customer')),
 created_at timestamptz not null default now()
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(name) between 1 and 120),
 category text not null check (category in ('men','women','kids','footwear')),
 sku text unique, description text,
 price numeric(10,2) not null check (price>=0),
 sale_price numeric(10,2) check (sale_price is null or (sale_price>=0 and sale_price<=price)),
 sizes text[] not null default '{}', colors text[] not null default '{}',
 stock_qty integer not null default 0 check (stock_qty>=0),
 image_url text, is_active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.products enable row level security;
create or replace function public.is_store_admin() returns boolean
language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;
revoke all on function public.is_store_admin() from public;
grant execute on function public.is_store_admin() to authenticated;
drop policy if exists "Read visible products" on public.products;
create policy "Read visible products" on public.products for select to anon,authenticated using (is_active=true or public.is_store_admin());
drop policy if exists "Admin insert products" on public.products;
create policy "Admin insert products" on public.products for insert to authenticated with check (public.is_store_admin());
drop policy if exists "Admin update products" on public.products;
create policy "Admin update products" on public.products for update to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
drop policy if exists "Admin delete products" on public.products;
create policy "Admin delete products" on public.products for delete to authenticated using (public.is_store_admin());
drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile" on public.profiles for select to authenticated using (id=auth.uid());
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "Public view product images" on storage.objects;
create policy "Public view product images" on storage.objects for select to anon,authenticated using(bucket_id='product-images');
drop policy if exists "Admin upload product images" on storage.objects;
create policy "Admin upload product images" on storage.objects for insert to authenticated with check(bucket_id='product-images' and public.is_store_admin());
drop policy if exists "Admin update product images" on storage.objects;
create policy "Admin update product images" on storage.objects for update to authenticated using(bucket_id='product-images' and public.is_store_admin()) with check(bucket_id='product-images' and public.is_store_admin());
drop policy if exists "Admin delete product images" on storage.objects;
create policy "Admin delete product images" on storage.objects for delete to authenticated using(bucket_id='product-images' and public.is_store_admin());
-- After creating the owner's user in Supabase Auth, run:
-- insert into public.profiles(id,role) values('REAL_AUTH_USER_UUID','admin')
-- on conflict(id) do update set role='admin';
