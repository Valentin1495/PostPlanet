import '@/app/globals.css';
import SearchBar from '@/components/search-bar';

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
