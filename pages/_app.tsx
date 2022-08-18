import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from '../components/navbar';
import { Container } from 'react-bootstrap';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <AppNavBar/>
    <Container>
      <Component {...pageProps} />
    </Container>

  </>
}

export default MyApp
