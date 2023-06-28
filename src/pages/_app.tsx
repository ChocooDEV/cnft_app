import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Spacer } from '../components/Spacer';
import { Footer } from '../components/Footer';
import Notifications from '../components/Notification'
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');
require("../styles/Card.css");


const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <title>Chocoo cNFTs</title>
          </Head>

          <ContextProvider>
            <div className="flex flex-col h-screen w-full">
              <Notifications />
              <AppBar/>
              <ContentContainer>
                <Component {...pageProps} />
                <Spacer size={300} />
                <Footer/>
              </ContentContainer>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
