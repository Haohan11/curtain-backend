import { MetronicI18nProvider } from '@/_metronic/i18n/Metronici18n'
import '@/_metronic/assets/sass/style.react.scss'
import '@/_metronic/assets/fonticon/fonticon.css'
import '@/_metronic/assets/keenicons/duotone/style.css'
import '@/_metronic/assets/keenicons/outline/style.css'
import '@/_metronic/assets/keenicons/solid/style.css'
import '@/_metronic/assets/sass/style.scss'

import Head from "next/head";
import DefaultLayout from "@/layout/defaultLayout";

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
          <Component {...pageProps} />
        </MetronicI18nProvider>
      </main>
    </>
  );
}
