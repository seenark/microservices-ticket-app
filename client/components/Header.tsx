import Link from "next/link";
import { FC, PropsWithChildren, ReactNode } from "react";
import { TUser } from "../pages/_app";

interface IHeaderProps {
  currentUser: TUser;
}
type TLink = {
  label: string;
  href: string;
};
const Header: FC<PropsWithChildren<IHeaderProps>> = (props) => {
  const links: ReactNode[] = [
    !props.currentUser && { label: "Sign Up", href: "/auth/signup" },
    !props.currentUser && { label: "Sign In", href: "/auth/signin" },
    props.currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map((link, index) => (
      <li key={index}>
        <Link href={(link as TLink).href}>
          <a>{(link as TLink).label}</a>
        </Link>
      </li>
    ));
  return (
    <>
      <nav className="p-4 flex justify-between bg-blue-100">
        <Link href="/">
          <a className=" text-2xl">Ticket App</a>
        </Link>
        <div>
          <ul className="flex flex-row gap-4">{links}</ul>
        </div>
      </nav>
    </>
  );
};
export default Header;
