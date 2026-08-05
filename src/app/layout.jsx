import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loader from "./components/loader/Loader";
import { AuthProvider } from "./providers";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Planto",
  description: "Created by Md. Mehedi Hasan",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className="hydrated"
    >
      <body>
<AuthProvider>
        <Loader>


           {children}


         </Loader>
            
</AuthProvider>

        
      </body>
    </html>
  );
}
