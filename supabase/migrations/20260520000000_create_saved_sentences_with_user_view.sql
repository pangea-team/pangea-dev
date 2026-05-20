create or replace view public.saved_sentences_with_user as
select
  ss.id,
  ss.note,
  ss.content_index,
  ss.created_at,
  u.name as user_name,
  u.trace as user_trace,
  ss.sentence_id,
  ss.user_id
from public.saved_sentences ss
left join public.users u on ss.user_id = u.id;
