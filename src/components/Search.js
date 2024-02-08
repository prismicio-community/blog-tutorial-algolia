"use client";

import { InstantSearch } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import SearchBox from "./SearchBox";
import SearchHits from "./SearchHits";

export function Search() {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
  );

  return (
    <InstantSearch searchClient={searchClient} indexName="blog">
      <div className="flex flex-col relative z-50">
        <SearchBox />
        <SearchHits />
      </div>
    </InstantSearch>
  );
}
