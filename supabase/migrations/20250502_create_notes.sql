-- Create the table
create table notes (
  id bigint primary key generated always as identity,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language 'plpgsql';

create trigger update_notes_updated_at
    before update on notes
    for each row
    execute function update_updated_at_column();

-- Insert some sample data into the table
insert into notes (title)
values
  ('Primeira nota do Cuide-Se'),
  ('Sistema de agendamento implementado'),
  ('Interface de profissionais configurada');

-- Enable Row Level Security
alter table notes enable row level security;

-- Create a policy to allow public read access
create policy "public can read notes"
on public.notes
for select to anon
using (true);

-- Create a policy to allow authenticated users to create notes
create policy "users can insert notes"
on public.notes
for insert to authenticated
with check (true);

-- Create a policy to allow authenticated users to update their own notes
create policy "users can update their own notes"
on public.notes
for update to authenticated
using (auth.uid() = notes.user_id)
with check (auth.uid() = notes.user_id);

-- Create a policy to allow authenticated users to delete their own notes
create policy "users can delete their own notes"
on public.notes
for delete to authenticated
using (auth.uid() = notes.user_id);
