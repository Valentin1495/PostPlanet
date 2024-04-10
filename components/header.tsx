'use client';

type HeaderProps = {
  postCount?: number;
  name?: string;
  isPostPage?: boolean;
};

export default function Header({ postCount, name, isPostPage }: HeaderProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header
      onClick={scrollToTop}
      className='sticky top-0 border-b-[0.5px] px-3 py-1.5 cursor-pointer backdrop-blur-md z-10'
    >
      {isPostPage ? (
        <h1 className='text-lg font-bold'>Post</h1>
      ) : (
        <>
          <h1 className='text-lg font-semibold'>{name}</h1>
          <h3 className='text-sm text-muted-foreground'>{postCount} posts</h3>
        </>
      )}
    </header>
  );
}
