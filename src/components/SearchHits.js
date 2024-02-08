import { connectStateResults, Highlight } from "react-instantsearch-dom";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";

function SearchHits({ searchState, searchResults }) {
  return searchState.query ? (
    <div className="relative">
      <div className="bg-white border border-gray-400 rounded-2xl absolute top-1 right-0 left-0 shadow-2xl">
        {searchResults?.hits.length === 0 && (
          <div className="py-3 px-6">No results found!</div>
        )}
        {searchResults?.hits.length > 0 &&
          searchResults.hits.map((hit) => {
            return (
              <Link
                key={hit.objectID}
                className="flex items-center gap-4 border-t border-gray-400 first:rounded-t-2xl last:rounded-b-2xl first:border-0 py-3 px-3 focus:outline-none focus:ring-4 ring-inset ring-gray-100 transition-colors hover:bg-gray-100"
                href={`/articles/${hit.slug}`}
              >
                {hit.image.url && (
                  <PrismicNextImage
                    field={hit.image}
                    className="w-1/4 aspect-[16/9] rounded-md block"
                  />
                )}
                <Highlight attribute="title" hit={hit} tagName="mark" />
              </Link>
            );
          })}
      </div>
    </div>
  ) : (
    <></>
  );
}
export default connectStateResults(SearchHits);
