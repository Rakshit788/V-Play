'use client';
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import { Provider  } from "react-redux";
import { store } from "@/redux/store";
import  { ThemeProvider } from "./components/theme-provider";



export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
            disableTransitionOnChange>
        <Provider store={store}>
          {children}
        </Provider>
      </ThemeProvider>
      </body>
    </html>
  );
}