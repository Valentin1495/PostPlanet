'use client';

export default function Header() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header
      onClick={scrollToTop}
      className='sticky top-0 text-lg font-bold border-b-[0.5px] p-3 cursor-pointer backdrop-blur-md z-10'
    >
      Post
    </header>
  );
}
