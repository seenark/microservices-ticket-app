import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import AxiosClient from "../utils/build-client";
import Header from "../components/Header";

export type TUser = {
  email: string;
  id: string;
};

const MyApp = ({
  Component,
  pageProps,
  currentUser,
}: AppProps & { currentUser: TUser }) => {
  console.log("pageProps", pageProps);
  console.log("current", currentUser);
  return (
    <>
      <Header currentUser={currentUser}></Header>
      <Component {...pageProps} />;
    </>
  );
};

MyApp.getInitialProps = async (appCtx: AppContext) => {
  try {
    const res = await AxiosClient(appCtx.ctx).get<TUser>(
      "/api/users/current-user"
    );
    let pageProps = {};
    if (appCtx.Component && appCtx.Component.getInitialProps) {
      pageProps = await appCtx.Component.getInitialProps(appCtx.ctx);
    }
    return {
      pageProps,
      currentUser: res.data,
    };
  } catch (error: any) {
    return {
      user: null,
    };
  }
};
export default MyApp;
