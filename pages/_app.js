import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps }, 
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute='class' defaultTheme='light'>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
