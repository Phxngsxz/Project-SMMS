import "./globals.css";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import localFont from "next/font/local";

const lineSeed = localFont({
  src: [
    {
      path: "../public/fonts/LINESeedSansTH_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedSansTH_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedSansTH_W_XBd.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedSansTH_W_He.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedSansTH_W_Th.woff2",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-line-seed",
  display: "swap",
});

export const metadata = {
  title: "Service Maintenant Management System",
  description: "Service Maintenant Management System",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={lineSeed.variable}>
      <link rel="icon" href="/favicon.ico" />
      <body>
        <NavigationMenu />
        {children}
      </body>
    </html>
  );
}
