import algoliasearch from "algoliasearch";
import { createClient } from "@/prismicio";
import { asText } from "@prismicio/client";

// Function that takes Prismic slices and transforms them into searchable text for Algolia.
const transformSlices = (slices) => {
  const textStrings = slices.map((slice) => {
    if (slice.slice_type === "text") {
      return asText(slice.primary.text);
    }
    if (slice.slice_type === "image") {
      return asText(slice.primary.caption);
    }
    if (slice.slice_type === "quote") {
      return asText(slice.primary.quote) + " " + slice.primary.source;
    }
  });

  return textStrings.join(" "); // Join items into a single string
};

export async function POST(request) {
  // Check if Algolia credentials exist, return error if not
  if (
    !process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID ||
    !process.env.ALGOLIA_ADMIN_KEY
  ) {
    return new Response("Algolia credentials are not set", {
      status: 500,
    });
  }

  try {
    // Instantiate Prismic and Algolia clients
    const prismicClient = createClient();
    const algoliaClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    // Initialize an Algolia index named 'blog'
    const index = algoliaClient.initIndex("blog");

    // Get all articles from Prismic
    const articles = await prismicClient.getAllByType("article");

    // Map articles to Algolia records
    const articleRecords = articles.map((post) => ({
      objectID: post.id, // Unique identifier in algolia
      title: asText(post.data.title), // Post title
      slug: post.uid, // Post URL slug
      image: post.data.featuredImage, // Post featured image
      text: transformSlices(post.data.slices), // Post content transformed to search text
    }));

    console.log(articleRecords);

    // Index records to Algolia
    await index.saveObjects(articleRecords);

    // Return success response if the process completes without any issue
    return new Response(
      "Content successfully synchronized with Algolia search",
      {
        status: 200,
      }
    );
  } catch (error) {
    // Log the error and return error response if any error occurs
    console.error(error);
    return new Response("An error occurred while synchronizing content", {
      status: 500,
    });
  }
}
