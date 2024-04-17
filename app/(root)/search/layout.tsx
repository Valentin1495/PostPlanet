import type { Metadata } from 'next';
import '@/app/globals.css';
import SearchBar from '@/components/search-bar';

export const metadata: Metadata = {
  title: 'PostPlanet',
  description:
    'A vibrant social media platform designed for quick, engaging conversations, allowing users to share updates, follow trends, and connect with a global community in real-time',
};

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen'>
      <div className='backdrop-blur-md z-10 sticky top-0 pt-5'>
        <SearchBar />
        {children}
      </div>
    </div>
  );
}
