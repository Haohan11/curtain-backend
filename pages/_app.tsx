import { MetronicI18nProvider } from '@/_metronic/i18n/Metronici18n'
import '@/_metronic/assets/sass/style.react.scss'
import '@/_metronic/assets/fonticon/fonticon.css'
import '@/_metronic/assets/keenicons/duotone/style.css'
import '@/_metronic/assets/keenicons/outline/style.css'
import '@/_metronic/assets/keenicons/solid/style.css'
import '@/_metronic/assets/sass/style.scss'

import dynamic from 'next/dynamic'
import Head from "next/head";
import { LayoutProvider } from '@/_metronic/layout/core'
import DefaultLayout from "@/layout/defaultLayout";

// need { MasterInit } to get sidebar work, but it require to control ther document node, so use dynamic import and with no ssr
const DynamicMasterInit = dynamic(async () => {
  const { MasterInit } = await import('@/_metronic/layout/MasterInit')
  return MasterInit
}, {ssr: false})

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return getLayout(
    <>
      <Head>
        <title>翔宇窗飾後台</title>
      </Head>
      <main>
        <MetronicI18nProvider>
          <LayoutProvider>
            <Component {...pageProps} />
            <DynamicMasterInit />
          </LayoutProvider>
        </MetronicI18nProvider>
      </main>
    </>
  );
}
