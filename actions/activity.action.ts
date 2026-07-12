'use server';

import { createClient } from '@/lib/supabase/server';
import { Activity } from '@/lib/types';

function mapActivity(row: {
  id: string;
  type: string;
  giver_id: string;
  receiver_id: string;
  post_id: string | null;
  text: string | null;
  created_at: string;
}): Activity {
  return {
    id: row.id,
    type: row.type as Activity['type'],
    giverId: row.giver_id,
    receiverId: row.receiver_id,
    postId: row.post_id,
    text: row.text,
    createdAt: row.created_at,
  };
}

export async function readActivities({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapActivity);
}
