import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import AxiosClient from "../utils/build-client";

type IUser = {
  email: string;
  id: string;
};

export type THome = {
  user: IUser | null;
  tickets: ITicket[];
};

export interface ITicket {
  _id: string;
  title: string;
  price: number;
}

const Home: NextPage<THome> = (props) => {
  const ticketList = props.tickets.map((ticket) => {
    return (
      <tr key={ticket._id} className="grid grid-cols-3 gap-8">
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/[ticketId]`} as={`/tickets/${ticket._id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1 className="text-2xl">Tickets</h1>
      <table>
        <thead>
          <tr className="grid grid-cols-3 gap-8">
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<THome> = async (
  context
) => {
  try {
    const axios = AxiosClient(context.req);
    const currentUserRes = await axios.get<IUser>("/api/users/current-user");
    console.log("res", currentUserRes.data);

    const ticketsRes = await axios.get<ITicket[]>("/api/tickets");
    console.log("tickets", ticketsRes.data);

    return {
      props: {
        user: currentUserRes.data,
        tickets: ticketsRes.data,
      },
    };
  } catch (error) {
    return {
      props: {
        user: null,
        tickets: [],
      },
    };
  }
};

export default Home;
