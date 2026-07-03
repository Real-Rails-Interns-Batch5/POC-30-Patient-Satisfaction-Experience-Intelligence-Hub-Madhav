import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infocreon Internship - Patient Experience Intelligence Hub",
  description: "Actionable HCAHPS, NPS and readmission intelligence for hospital quality teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
