'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body>
        <main className='min-h-screen flex items-center justify-center px-6'>
          <section className='max-w-sm space-y-4 text-center'>
            <h1 className='text-2xl font-semibold'>Something went wrong</h1>
            <p className='text-sm text-muted-foreground'>
              {error.message || 'A server error occurred.'}
            </p>
            <button
              type='button'
              onClick={reset}
              className='rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90 transition'
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
