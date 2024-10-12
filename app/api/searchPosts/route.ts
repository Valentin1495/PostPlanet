import { searchPosts } from '@/lib/api';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const q = searchParams.get('q');

  if (q === null || limit === null || page === null) return;

  const posts = await searchPosts({
    q,
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: posts });
}
