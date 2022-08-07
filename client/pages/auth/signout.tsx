import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRequest } from "../../hooks/use-request";

interface ISignOutProps {}

const SignOut: React.FunctionComponent<ISignOutProps> = (props) => {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess(data) {
      router.push("/");
    },
  });
  useEffect(() => {
    (async () => {
      doRequest();
    })();
  }, []);

  return <div>Signin you out...</div>;
};

export default SignOut;
