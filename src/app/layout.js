"use client"; // This line ensures that you can use React hooks like useState

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Separator } from "./components/separator";
import { Welcome } from "./components/welcome";
import { Header } from "./components/header";
import { GenerateButton } from "./components/generate_button";
import { TextBox } from "./components/textbox";
import { ResponseButton } from "./components/response_button";
import { ArticlesDisplay } from "./components/articles_display";

// Google font import
const inter = Inter({ subsets: ["latin"] });

// Root layout component
export default function RootLayout({ children }) {
  const [input, setInput] = useState("");
  const [articles, setArticles] = useState([]);

  const handleGenerate = async () => {
    try {
      const response = await fetch("/api/articles", {
        method: "POST", // Assuming your backend expects a POST request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }), // Send any relevant data here
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles); // Assuming your API returns an 'articles' array
      } else {
        console.error("Failed to fetch articles:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className="container"
          style={{
            alignContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            minWidth: "100vw",
          }}
        >
          <Header />
          <Welcome />
          <Separator />
          <GenerateButton onClick={handleGenerate} />
          <TextBox
            onChange={(changedInput) => setInput((prev) => changedInput)}
            value={input}
          />
          <div className="response-section">
            <ResponseButton text="Yes" />
            <ResponseButton text="No" />
          </div>
          <ArticlesDisplay articles={articles} />
        </div>

        {children}
      </body>
    </html>
  );
}
