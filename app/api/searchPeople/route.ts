import { createClient } from '@/lib/supabase/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const q = searchParams.get('q');

  if (q === null || limit === null || page === null) {
    return Response.json({ result: [] });
  }

  let query = q;
  if (query.includes(' ')) {
    query = query.replace(/ /g, '');
  }

  const supabase = await createClient();
  const limitNum = parseInt(limit);
  const pageNum = parseInt(page);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('username', `%${query}%`)
    .range(pageNum * limitNum, pageNum * limitNum + limitNum - 1);

  if (error) {
    console.error(error);
    return Response.json({ result: [] });
  }

  const people = (data ?? []).map((row) => ({
    id: row.id,
    username: row.username,
    name: row.name,
    bio: row.bio,
    profileImage: row.profile_image,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return Response.json({ result: people });
}
