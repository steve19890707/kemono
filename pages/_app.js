import Head from "next/head";
import { Provider } from "react-redux";
import store from "../reducer/store";
import Router from "next/router";
import NProgress from "nprogress";
import Layout from "../components/Layout";
import "/public/nprogress.css";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const assetBasePath = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/kemono" : "";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <title>CQ9 GAMING 後台</title>
        <link rel="icon" href={`${assetBasePath}/favicon.ico`} />
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  );
}
