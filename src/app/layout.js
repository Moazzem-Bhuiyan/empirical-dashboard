import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "../lib/Providers";
import ReduxProviders from "@/redux/lib/ReduxProvider";
import { Toaster } from "react-hot-toast";

const generalSans = localFont({
  src: "../assets/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "100 900",
  display: "swap",
  subsets: ["latin"],
});

const Mont_serrat = Montserrat({
  variable: "--font-montserrat",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata = {
  title: {
    default: "Empirical -  Website",
    template: "%s | Empirical -  Website",
  },
  description:
    "Empirical is a cutting-edge platform that leverages advanced technologies to provide innovative solutions for data analysis, visualization, and decision-making. Our mission is to empower businesses and individuals with the tools they need to harness the power of their data effectively.",
  keywords: [
    "Empirical, data analysis, data visualization, decision-making, innovative solutions, cutting-edge platform, data-driven insights, business intelligence, data science, machine learning",
  ],
  authors: [{ name: "Empirical Team", url: "https://imperialempirical.com" }],
  openGraph: {
    title: "Empirical -  Website",
    description:
      "Empirical is a Building fashion that speaks to you, while respecting the planet and empowering communities through ethical practices.",
    url: "https://imperialempirical.com",
    siteName: "Empirical",
    images: [
      {
        url: "https://i.ibb.co/fzjJ8WxQ/image.png",
        width: 1200,
        height: 630,
        alt: "Empirical Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Empirical -  Website",
    description:
      "Empirical is a Building fashion that speaks to you, while respecting the planet and empowering communities through ethical practices.",
    images: ["https://i.ibb.co/fzjJ8WxQ/image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${generalSans.className} ${Mont_serrat.variable} box-border antialiased`}
      >
        {" "}
        <Providers>
          {" "}
          <ReduxProviders>
            <Toaster richColors position="top-center" />
            <Providers>{children}</Providers>
          </ReduxProviders>
        </Providers>
      </body>
    </html>
  );
}
