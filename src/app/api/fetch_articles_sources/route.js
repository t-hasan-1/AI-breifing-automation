import { NextResponse } from "next/server";

const BASE_URL = "https://newsapi.org/v2/everything?";

const TERMS_NATIONAL =
  "(AI OR CHATGPT) OR (GOVERNMENT AND AI) AND (NOT INDIA NOT CHINA NOT RUSSIA NOT EUROPE)";
const TERMS_WORLD =
  "(AI OR CHATGPT) OR (GOVERNMENT AND AI) AND (CHINA OR RUSSIA OR INDIA OR EUROPE OR EU)";
const HOURS_AGO = 24;
const format_date = (date) => date.toISOString().split("T")[0];
const TODAY = new Date();
const CONFIGURABLE_HOURS_AGO = new Date(
  TODAY.getTime() - HOURS_AGO * 60 * 60 * 1000
);
const TO_DATE = format_date(TODAY);
const FROM_DATE = format_date(CONFIGURABLE_HOURS_AGO);
const LANGUAGE = "en";

const fetch_url = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const article_sources = data.articles ?? [];
    return article_sources.filter((article_source) => {
      const { source, title, author, url, content } = article_source;
      return source?.name && title && author && url && content;
    });
  } catch (error) {
    console.error("Fetching articles failed:", error);
    return null;
  }
};

export async function GET(request) {
  const API_KEY = process.env.NEWS_API_KEY;

  const encoded_query_national = encodeURIComponent(TERMS_NATIONAL);
  const encoded_query_world = encodeURIComponent(TERMS_WORLD);

  const final_url_national = `${BASE_URL}q=${encoded_query_national}&from=${FROM_DATE}&to=${TO_DATE}&language=${LANGUAGE}&pageSize=30&apiKey=${API_KEY}`;
  const final_url_world = `${BASE_URL}q=${encoded_query_world}&from=${FROM_DATE}&to=${TO_DATE}&language=${LANGUAGE}&pageSize=30&apiKey=${API_KEY}`;

  const articles_national = await fetch_url(final_url_national);
  const articles_world = await fetch_url(final_url_world);

  const articles = {
    articles_national: articles_national,
    articles_world: articles_world,
  };

  // Cache result
  // const filePath = path.join(process.cwd(), 'public', 'articles.json');
  // fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf-8');

  return NextResponse.json(articles);
}
