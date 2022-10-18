import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";
import { getServerSideProps as HomeGetServerSideProps, THome } from "..";
import { useRequest } from "../../hooks/use-request";
import AxiosClient from "../../utils/build-client";
import { TUser } from "../_app";

interface INewTicketProps {}

const NewTicket: React.FunctionComponent<INewTicketProps> = (props) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);

  const { doRequest, error } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess(data) {
      console.log(data);
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    doRequest();
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            className="border border-black-200 w-[300px]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            className="border border-black-200 w-[300px]"
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
          />
        </div>
        {error}
        <button type="submit" className="bg-blue-500 rounded w-[150px]">
          Submit
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  user: TUser | null;
}> = async (context) => {
  try {
    const axios = AxiosClient(context.req);
    const res = await axios.get<TUser>("/api/users/current-user");
    console.log("res", res.data);
    return {
      props: {
        user: res.data,
      },
    };
  } catch (error) {
    return {
      props: {
        user: null,
      },
    };
  }
};

export default NewTicket;
