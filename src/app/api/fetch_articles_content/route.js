import { NextResponse } from "next/server";
const cheerio = require("cheerio");

const scrape = async (url) => {
  try {
    // Fetch the HTML content of the page
    const response = await fetch(url);

    // Ensure the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Convert the response to text (HTML content)
    const htmlContent = await response.text();

    // Load the HTML into cheerio
    const $ = cheerio.load(htmlContent);

    // Remove unwanted elements before extracting content
    const unwantedSelectors = [
      "script",
      "style",
      "nav",
      "header",
      "footer",
      ".advertisement",
      ".sidebar",
      "iframe",
      "figcaption",
      "a",
      "button",
      "input",
      "form",
      "noscript",
    ];
    unwantedSelectors.forEach((selector) => $(selector).remove());

    // Try different selectors to find the main content
    const contentSelectors = [
      "article",
      'div[class*="content"]',
      'div[class*="article"]',
      "main",
      'section[class*="content"]',
    ];
    let articleContent = "";

    for (const selector of contentSelectors) {
      const contentContainer = $(selector);
      if (contentContainer.length) {
        articleContent = contentContainer
          .find("p") // Focus only on paragraphs
          .map((_, element) => $(element).text().trim())
          .get()
          .filter((text) => text.length > 50) // Filter out very short text snippets
          .join(" ");
        if (articleContent) break;
      }
    }

    // Fallback to basic extraction if no specific container is found
    if (!articleContent) {
      articleContent = $("body")
        .find("p")
        .map((_, element) => $(element).text().trim())
        .get()
        .filter((text) => text.length > 50) // Filter out very short text snippets
        .join(" ")
        .trim();
    }

    return articleContent.trim();
  } catch (error) {
    console.error(`Error scraping content from ${url}:`, error.message);
    return "Failed to fetch summary.";
  }
};

export async function POST(request) {
  const body = await request.json();

  const articles = body.articles ?? [];

  const scrape_promises = articles.map((article) => {
    const url = article?.url;
    return scrape(url);
  });
  const summaries = await Promise.all(scrape_promises);

  const result = articles.map((article, index) => ({
    ...article,
    content: summaries[index],
  }));

  return NextResponse.json({
    articles: result,
  });
}
