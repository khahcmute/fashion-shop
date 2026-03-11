import UserNavbar from "@/components/UserNavbar";
import Footer from "@/components/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
