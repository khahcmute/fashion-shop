import UserNavbar from "@/components/UserNavbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserNavbar />
      <main>{children}</main>
    </>
  );
}
