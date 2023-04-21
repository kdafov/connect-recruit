import '@/styles/globals.css'
import 'typeface-montserrat';
import { AuthWrapper } from '@/context/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>
  )
}
