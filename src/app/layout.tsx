import "./globals.css";
import ReduxProvider from "@/store/provider";
import AuthLoader from "@/components/AuthLoader";

export const metadata = {
  title: "Fashion Shop",
  description: "Ecommerce shop thời trang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <ReduxProvider>
          <AuthLoader />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
