import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

export const ytOfficialData = async (videoUrl: string) => {
  const ytOfficialAPI = "https://www.googleapis.com/youtube/v3/videos";
  const ytOfficialUrl = new URL(ytOfficialAPI);
  ytOfficialUrl.searchParams.set(
    "key",
    process.env.YT_API_KEY!
  );
  ytOfficialUrl.searchParams.set(
    "part",
    "snippet,statistics,recordingDetails,status,liveStreamingDetails,localizations,contentDetails,paidProductPlacementDetails,player,topicDetails"
  );
  ytOfficialUrl.searchParams.set("id", videoUrl.split("v=")[1]!);
  ytOfficialUrl.searchParams.set("_", Date.now().toString());

  return await fetch(ytOfficialUrl.toString())
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching video data:", err);
      return null;
    });
};

function parseISODuration(iso: string) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, hours = 0, minutes = 0, seconds = 0] = regex.exec(iso) || [];
  return {
    hours: parseInt(hours || "0"),
    minutes: parseInt(minutes || "0"),
    seconds: parseInt(seconds || "0"),
  };
}

export const durationToMinutes = (duration: string) => {
  const { hours, minutes } = parseISODuration(duration);
  return hours * 60 + minutes;
};

export const viewsInK = (views: string) => {
  return parseInt(views) > 1000
    ? `${(parseInt(views) / 1000).toFixed(1)}K`
    : views;
};

export const readDurationInMinsFromWords = (
  paragraph: string,
  wordsPerMinute: number = 200
) => {
  const wordCount = paragraph.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const markdownToSanitizedHtml = (markdown: string): string => {
  // Create a DOM window for DOMPurify
  const window = new JSDOM('').window;
  const DOMPurifyWindow = DOMPurify(window);
  
  // Convert markdown to HTML
  const html = marked(markdown);
  
  // Sanitize the HTML
  return DOMPurifyWindow.sanitize(html as string);
};

export interface TopArticle {
  title: string;
  views: number;
  link: string;
}

/**
 * Fetches the top 6 articles from Google Analytics with titles and view counts
 * @param keyFilePath Path to the Google Analytics service account key file
 * @param propertyId Google Analytics property ID
 * @returns Array of top articles with title, views, and link (titles are fetched directly from GA)
 */
export const getTopArticles = async (
  keyFilePath: string,
  propertyId: string
): Promise<TopArticle[]> => {
  try {
    // Initialize Analytics Data Client
    const analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: keyFilePath,
    });

    // Fetch report data for the past 30 days
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "pagePath",
        },
        {
          name: "pageTitle",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
      ],
      limit: 20, // Fetch more results to filter them down later
    });

    const mostReadArticles: TopArticle[] = [];
    const allowedFolders = ["/articles/", "/interviews/", "/advice/", "/personality-tests/"];

    // Filter function to check if page path is in allowed folders
    const isValidPage = (pagePath: string): boolean => {
      return allowedFolders.some((folder) => pagePath.includes(folder));
    };



    // Process the response rows
    if (response.rows) {
      for (const row of response.rows) {
        if (mostReadArticles.length >= 6) {
          break;
        }

        const pagePath = row.dimensionValues?.[0]?.value;
        const pageTitle = row.dimensionValues?.[1]?.value;
        const pageViews = row.metricValues?.[0]?.value;

        if (!pagePath || !pageViews || !isValidPage(pagePath)) {
          continue;
        }

        // Construct the full URL
        const fullUrl = `https://therapytips.org${pagePath}`;

        // Use the page title from Google Analytics
        const title = pageTitle || "No title found";

        // Add to the results
        mostReadArticles.push({
          title,
          views: parseInt(pageViews),
          link: fullUrl,
        });
      }
    }

    return mostReadArticles;
  } catch (error) {
    console.error("Error fetching top articles:", error);
    throw error;
  }
};
