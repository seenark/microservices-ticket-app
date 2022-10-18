import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import AxiosClient from "../utils/build-client";
import Header from "../components/Header";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export type TUser = {
  email: string;
  id: string;
};

const stripePromise = loadStripe(
  "pk_test_51LtBf9FsFJxYdlw1MLNdLqY45HJj7D2Gy4XXfzIsv18XMVfsvUiSoPfkuaro4ED5ULhghtJtnxvC9Yz8L7ChdvwI00MMy8iovV"
);
const MyApp = ({ Component, pageProps }: AppProps) => {
  console.log("pageProps", pageProps);
  return (
    <>
      <Header currentUser={pageProps.user}></Header>
      <Elements stripe={stripePromise}>
        <Component {...pageProps} />
      </Elements>
    </>
  );
};

export default MyApp;
