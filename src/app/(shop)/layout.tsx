import UserNavbar from "@/components/UserNavbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserNavbar />
      <Breadcrumb />
      <main>{children}</main>
      <Footer />
    </>
  );
}
