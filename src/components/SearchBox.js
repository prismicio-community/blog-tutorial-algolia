import { connectSearchBox } from "react-instantsearch-dom";

function SearchBox({ refine }) {
  return (
    <input
      type="search"
      className="w-96 mx-auto border border-gray-400 rounded-full px-4 py-3 focus:outline-none focus:border-gray-500"
      placeholder="What are you looking for?"
      onChange={(e) => refine(e.currentTarget.value)}
    />
  );
}

export default connectSearchBox(SearchBox);
