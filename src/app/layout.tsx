import "./globals.css";
import ReduxProvider from "@/store/provider";

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
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
