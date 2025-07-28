import type { Metadata } from "next";
import "./globals.scss";
import { ReduxProvider } from "../store/ReduxProvider";



export const metadata: Metadata = {
  title: "Carbon Todo List",
  description: "A professional todo list built with Next.js and IBM Carbon Design System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
