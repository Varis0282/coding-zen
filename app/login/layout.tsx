import '@ant-design/v5-patch-for-react-19';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "My Day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
