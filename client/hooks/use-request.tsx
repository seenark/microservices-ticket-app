import axios, { AxiosRequestConfig } from "axios";
import { ReactNode, useState } from "react";

type TUseRequest = {
  url: string;
  method: "post" | "get";
  body: Record<string, any>;
  onSuccess: (data: Record<string, any>) => void;
};
export function useRequest(data: TUseRequest) {
  const { url, method, body, onSuccess } = data;
  const [error, setError] = useState<ReactNode | null>(null);

  const doRequest = async () => {
    try {
      setError(null);
      const config: AxiosRequestConfig = {
        url: url,
        data: body,
        method: method,
        withCredentials: true,
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
