import axios, { AxiosRequestConfig } from "axios";
import { ReactNode, useState } from "react";

type TUseRequest<Body extends Record<string, any>> = {
  url: string;
  method: "post" | "get";
  body: Body;
  onSuccess: (data: Record<string, any>) => void;
};
export function useRequest<Body extends Record<string, any>>(
  data: TUseRequest<Body>
) {
  const { url, method, body, onSuccess } = data;
  const [error, setError] = useState<ReactNode | null>(null);

  const doRequest = async () => {
    console.table(body);
    try {
      setError(null);
      const config: AxiosRequestConfig<Body> = {
        url: url,
        data: body,
        method: method,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios(config);
      onSuccess(res.data);
    } catch (error: any) {
      const errMsg = error.response.data.message;
      setError(
        <div className=" bg-red-300 p-4">
          <h4 className=" text-4xl">Oops...</h4>
          <p className=" text-2xl">{errMsg}</p>
        </div>
      );
    }
  };

  return {
    doRequest,
    error,
  };
}
