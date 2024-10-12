import { getAllPosts } from '@/lib/api';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');

  if (limit === null || page === null) return;

  const allPosts = await getAllPosts(parseInt(limit), parseInt(page));

  return Response.json({ result: allPosts });
}
