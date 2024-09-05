"use client"; // This line ensures that you can use React hooks like useState

import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Welcome } from "../components/welcome";
import { Header } from "../components/header";
import { GenerateButton } from "../components/generate_button";
import { TextBox } from "../components/textbox";
import { ResponseButton } from "../components/response_button";
import { ArticlesDisplay } from "../components/articles_display";
import { Separator } from "../components/separator";

// Google font import
const inter = Inter({ subsets: ["latin"] });

// Root layout component
export default function RootLayout({ children }) {
  const [articleSources, setArticleSources] = useState({});
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [articleToDisplay, setArticleToDisplay] = useState(
    "Loading articles to select from..."
  );

  const fetchArticleSources = async () => {
    const response = await fetch("/api/fetch_articles_sources");
    const data = await response.json();
    const { articles_national, articles_world } = data;
    console.log(articles_national, articles_world);

    return data;
  };

  const fetchArticleContent = async () => {
    const response = await fetch("/api/fetch_articles_content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articles: selectedArticles }),
    });

    const { articles } = await response.json();
    console.log(articles);
    return articles;
  };

  React.useEffect(() => {
    // On page load, fetch the article sources
    fetchArticleSources().then(setArticleSources);
  }, []);

  const getNextArticleToSelect = () => {
    const { articles_national, articles_world } = articleSources;
    let articlesToChooseFrom = [];
    if (selectedArticles.length <= 5) {
      console.log("Selecting from articles national!");
      articlesToChooseFrom = articles_national ?? [];
    } else {
      articlesToChooseFrom = articles_world ?? [];
    }

    return articlesToChooseFrom?.[0];
  };

  const prettyifyArticleSource = (articleSource) => {
    const cleanedArticle = {
      source: articleSource.source.name,
      author: articleSource.author,
      title: articleSource.title,
      url: articleSource.url,
    };

    return JSON.stringify(cleanedArticle, null, "\t");
  };

  React.useEffect(() => {
    const articleToSelect = getNextArticleToSelect();

    if (articleToSelect) {
      setArticleToDisplay(prettyifyArticleSource(articleToSelect));
    } else {
      setArticleToDisplay("No articles left to display. Fetching summaries...");
    }
  }, [articleSources]);

  const selectArticle = () => {
    const articleToSelect = getNextArticleToSelect();
    if (!articleToSelect) {
      return;
    }

    setSelectedArticles([...selectedArticles, articleToSelect]);
    setArticleSources({
      articles_national: articleSources.articles_national.filter(
        (article) => article != articleToSelect
      ),
      articles_world: articleSources.articles_world.filter(
        (article) => article != articleToSelect
      ),
    });
  };

  const rejectArticle = () => {
    const articleToSelect = getNextArticleToSelect();
    if (!articleToSelect) {
      return;
    }

    setArticleSources({
      articles_national: articleSources.articles_national.filter(
        (article) => article != articleToSelect
      ),
      articles_world: articleSources.articles_world.filter(
        (article) => article != articleToSelect
      ),
    });
  };

  const finishedSelectingArticles = () => {
    return selectedArticles.length === 7 || !getNextArticleToSelect();
  };

  const prettyPrintSummarizedArticle = (article) => {
    const { author, title, url, publishedAt, content } = article;
    const source = article?.source?.name;

    const summary = content
      .split(/[.!?]/g)
      .filter((sentence) => sentence.trim())
      .slice(0, 10)
      .join(".");

    return `Title: ${title}\nAuthor: ${author}\nDate: ${publishedAt}\nURL: ${url}\n\n${summary}.`;
  };

  React.useEffect(() => {
    // When we are done selecting the articles, go ahead and fetch the summary and display them.

    if (finishedSelectingArticles()) {
      // Go ahead and fetch the content and display it
      fetchArticleContent().then((finalArticles) => {
        const prettyArticles = finalArticles
          .map(prettyPrintSummarizedArticle)
          .join("\n\n");
        setArticleToDisplay(prettyArticles);
      });
    }
  }, [articleToDisplay, selectedArticles]);

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
          {/* <GenerateButton /> */}
          <TextBox value={articleToDisplay} />
          <div className="response-section">
            <ResponseButton text="Yes" onClick={selectArticle} />
            <ResponseButton text="No" onClick={rejectArticle} />
          </div>
          {/* <ArticlesDisplay articles={articles} /> */}
        </div>

        {children}
      </body>
    </html>
  );
}
