import '@/_metronic/assets/sass/style.react.scss'
import '@/_metronic/assets/fonticon/fonticon.css'
import '@/_metronic/assets/keenicons/duotone/style.css'
import '@/_metronic/assets/keenicons/outline/style.css'
import '@/_metronic/assets/keenicons/solid/style.css'
import '@/_metronic/assets/sass/style.scss'

import dynamic from 'next/dynamic'
import Head from "next/head";

import axios from 'axios'
import { AuthProvider, setupAxios } from '@/_metronic/auth'

import { MetronicI18nProvider } from '@/_metronic/i18n/Metronici18n'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LayoutProvider } from '@/_metronic/layout/core'

import DefaultLayout from "@/layout/defaultLayout";

setupAxios(axios)

// need { MasterInit } to get sidebar work, but it require to control ther document node, so use dynamic import and with no ssr
const DynamicMasterInit = dynamic(async () => {
  const { MasterInit } = await import('@/_metronic/layout/MasterInit')
  return MasterInit
}, { ssr: false })

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient()

  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return getLayout(
    <>
      <Head>
        <title>翔宇窗飾後台</title>
      </Head>
      <main>
        <QueryClientProvider client={queryClient}>
          <MetronicI18nProvider>
            <LayoutProvider>
              <AuthProvider>
                <Component {...pageProps} />
                <DynamicMasterInit />
              </AuthProvider>
            </LayoutProvider>
          </MetronicI18nProvider>
        </QueryClientProvider>
      </main>
    </>
  );
}
