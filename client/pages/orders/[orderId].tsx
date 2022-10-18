import { GetServerSideProps } from "next";
import { TUser } from "../_app";
import AxiosClient from "../../utils/build-client";
import { FormEvent, useEffect, useState } from "react";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosClient from "../../utils/build-client";

export interface Ticket {
  _id: string;
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface IOrder {
  userId: string;
  status: string;
  expiresAt: string;
  ticket: Ticket;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

interface IOrderIdProps {
  user: TUser | null;
  order: IOrder;
}

// const stripePromise = loadStripe( "pk_test_51LtBf9FsFJxYdlw1MLNdLqY45HJj7D2Gy4XXfzIsv18XMVfsvUiSoPfkuaro4ED5ULhghtJtnxvC9Yz8L7ChdvwI00MMy8iovV");
const OrderId: React.FunctionComponent<IOrderIdProps> = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (elements === null) {
      return;
    }

    if (!stripe) return;
    const cardelements = elements.getElement(CardElement);
    if (!cardelements) return;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardelements,
    });
    console.log(error);
    try {
      const payment = paymentMethod;
      console.log(payment);
      if (!payment) {
        console.log("no payment");
        return;
      }
      const axios = axiosClient();
      const paymentRes = await axios.post("/api/payments", {
        orderId: order._id,
        token: payment.id,
      });
      console.log("payment res", paymentRes.data);
    } catch (error) {
      console.log("strice create payment error");
      console.log(error);
    }
  }
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const interval = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [order.expiresAt]);

  if (timeLeft <= 0) {
    return <h1>Order Expired</h1>;
  }

  return (
    <div>
      <h1 className="text-4xl">Purchasing {order.ticket.title}</h1>
      <h4 className="text-2xl">Time left to pay {timeLeft} seconds</h4>
      <form onSubmit={handleFormSubmit} className="bg-green-100 p-4 w-[300px]">
        <CardElement />
        <button type="submit" className="py-2 px-4 bg-green-400 py-4 rounded">
          Pay
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<IOrderIdProps> = async (
  context
) => {
  try {
    const axios = AxiosClient(context.req);
    const currentUserRes = await axios.get<TUser>("/api/users/current-user");
    console.log("res", currentUserRes.data);

    const { orderId } = context.query;
    const orderRes = await axios.get<IOrder>(`/api/orders/${orderId}`);
    console.log("order", orderRes.data);

    return {
      props: {
        user: currentUserRes.data,
        order: orderRes.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default OrderId;
