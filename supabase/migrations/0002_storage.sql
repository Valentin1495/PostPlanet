-- Storage bucket for profile & post images.
-- Files are stored under "<user_id>/<filename>" so RLS can check ownership
-- via the first path segment (storage.foldername(name)[1]).

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

create policy "images_insert_own_folder" on storage.objects
  for insert with check (
    bucket_id = 'images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "images_update_own_folder" on storage.objects
  for update using (
    bucket_id = 'images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "images_delete_own_folder" on storage.objects
  for delete using (
    bucket_id = 'images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
