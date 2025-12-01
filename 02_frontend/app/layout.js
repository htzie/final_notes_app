import "./globals.css";

export const metadata = {
  title: "Notes App",
  description: "Protected Notes"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
