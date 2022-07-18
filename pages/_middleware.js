import { getToken } from 'next-auth/jwt'
import { NextResponse } from "next/server"

export async function middleware(req) {
  const { pathname } = req.nextUrl
  
  const token = await getToken({ req, secret: process.env.JWT_SECRET})

  if (pathname.includes('/api/auth') || token) {
      return NextResponse.next()
  }

  if (pathname !== '/auth/signin' && !token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
}
