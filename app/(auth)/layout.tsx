import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'What is happening? / PostPlanet',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
