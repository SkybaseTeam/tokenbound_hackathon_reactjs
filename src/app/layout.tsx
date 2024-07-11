import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import '@/styles/custom.scss';
import { ConfigProvider } from 'antd';
import StoreProvider from '@/context/store';
import Layout from '@/Layouts';
import { StarknetProvider } from '@/context/StarknetProvider';

export const metadata: Metadata = {
  title: 'BlingBling',
  description: 'BlingBling - Starknet Tokenbound Hackathon',
};

const glancyr = localFont({
  src: [
    {
      path: '../assets/fonts/glancyr/glancyr-glancyr-bold-700.otf',
      weight: '700',
      style: 'bold',
    },
    {
      path: '../assets/fonts/glancyr/glancyr-glancyr-semibold-600.otf',
      weight: '600',
      style: 'semi-bold',
    },
    {
      path: '../assets/fonts/glancyr/glancyr-glancyr-medium-500.otf',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../assets/fonts/glancyr/glancyr-glancyr-regular-400.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/glancyr/glancyr-glancyr-thin-200.otf',
      weight: '200',
      style: 'light',
    },
  ],
  variable: '--font-glancyr',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${glancyr.variable} font-glancyr`}>
        <StarknetProvider>
          <StoreProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#00C089',
                },
              }}
            >
              <Layout>
                {children}
                {/* Google Analytics */}
                {/* <GoogleAnalytics gaId='G-5JCE19WNL6' /> */}
              </Layout>
            </ConfigProvider>
          </StoreProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
