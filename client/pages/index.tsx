import type { NextPage } from "next";
import AxiosClient from "../utils/build-client";
type IUser = {
  email: string;
  id: string;
};
type THome = {
  user: IUser | null;
};
const Home: NextPage<THome> = (props) => {
  return (
    <>
      {props.user ? (
        <h1 className=" text-4xl">You are signed in</h1>
      ) : (
        <h1 className=" text-4xl">You are not signed in</h1>
      )}
    </>
  );
};

Home.getInitialProps = async (ctx) => {
  try {
    const res = await AxiosClient(ctx).get<IUser>("/api/users/current-user");
    return {
      user: res.data,
    };
  } catch (error: any) {
    return {
      user: null,
    };
  }
};

export default Home;
