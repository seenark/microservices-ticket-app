import axios, { Axios } from "axios";
import { NextPageContext } from "next";

export type TAxiosClient = (ctx: NextPageContext) => Axios;
const axiosClient: TAxiosClient = ({ req }) => {
  if (req != undefined) {
    // on SSR
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: {
        host: req.headers.host || "",
        cookie: req.headers.cookie || "",
      },
    });
  } else {
    // on CSR
    return axios.create({
      baseURL: "/",
    });
  }
};

export default axiosClient;
