import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useRequest } from "../../hooks/use-request";

interface ISignInProps {}

const SignIn: React.FunctionComponent<ISignInProps> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { error, doRequest } = useRequest({
    url: "/api/users/signin",
    body: { email, password },
    method: "post",
    onSuccess: (data) => {
      router.push("/");
    },
  });

  async function onSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    doRequest();
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <h1 className="text-4xl">Sign in</h1>
      <div className="flex flex-col">
        <label>Email Address</label>
        <input
          className=" border border-gray-500 rounded w-[300px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>
      <div className="flex flex-col">
        <label>Password</label>
        <input
          className=" border border-gray-500 rounded w-[300px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      {error}
      <button className="w-[150px] bg-blue-300 px-4 py-2 rounded-md border border-gray-500">
        Sign in
      </button>
    </form>
  );
};

export default SignIn;
