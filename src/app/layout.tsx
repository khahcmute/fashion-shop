import "./globals.css";
import ReduxProvider from "@/store/provider";
import AuthLoader from "@/components/AuthLoader";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import GoogleSessionBridge from "@/components/GoogleSessionBridge";

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
        <AuthSessionProvider>
          <ReduxProvider>
            <AuthLoader />
            <GoogleSessionBridge />
            {children}
          </ReduxProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
