import { GetServerSideProps, NextPage } from "next";
import { TUser } from "../_app";
import AxiosClient from "../../utils/build-client";
import { useRequest } from "../../hooks/use-request";
import { useRouter } from "next/router";

interface ITicketIdProps {
  user: TUser | null;
  ticket: ITicket | null;
}

interface ITicket {
  title: string;
  id: string;
  price: number;
  userId: string;
}

const TicketId: NextPage<ITicketIdProps> = ({ ticket }) => {
  const router = useRouter();
  const { doRequest, error } = useRequest<{ ticketId: string }>({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket ? ticket.id : "",
    },
    onSuccess(order) {
      console.log(order);
      router.push("/orders/[orderId]", `/orders/${order._id}`);
    },
  });
  return (
    <>
      {ticket && (
        <div>
          <h1 className="text-4xl">{ticket.title}</h1>
          <h4 className="text-2xl">Price: {ticket.price}</h4>
          {error}
          <button className="rounded py-2 px-4 bg-blue-300" onClick={doRequest}>
            Purchase
          </button>
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ITicketIdProps> = async (
  context
) => {
  try {
    const axios = AxiosClient(context.req);
    const currentUserRes = await axios.get<TUser>("/api/users/current-user");
    console.log("res", currentUserRes.data);

    const ticketId = context.query.ticketId;
    const ticketRes = await axios.get<ITicket>(`/api/tickets/${ticketId}`);
    console.log("ticket", ticketRes.data);

    return {
      props: {
        user: currentUserRes.data,
        ticket: ticketRes.data,
      },
    };
  } catch (error) {
    return {
      props: {
        user: null,
        ticket: null,
      },
    };
  }
};

export default TicketId;
