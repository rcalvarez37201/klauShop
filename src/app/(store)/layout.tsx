import { CartSheet } from "@/features/carts";
import MainFooter from "@/components/layouts/MainFooter";
import Navbar from "@/components/layouts/MainNavbar";
import CategoriesSubNav from "@/components/layouts/CategoriesSubNav";
import { ReactNode } from "react";

type Props = { children: ReactNode };

async function StoreLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <CategoriesSubNav />
      <main className="pt-[50px] md:pt-[114px]">{children}</main>
      <CartSheet />
      <MainFooter />
    </>
  );
}

export default StoreLayout;
