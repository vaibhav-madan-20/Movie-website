import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getMovieSearchUrl } from '../utils/constants';
import LANGUAGE_CONSTANTS from "../utils/languageConstants";
import { askAI } from "../utils/gemini";
import { addGptMovies } from '../utils/gptSlice';
import VideoList from './VideoList';

const GptSearch = () => {
  const { gptMovies, gptNames } = useSelector((store) => store.gpt);
  const dispatch = useDispatch();
  const searchText = useRef(null);
  const selectedLanguage = useSelector(state => state.language.lang);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function tmdbSearch(movie) {
    const url = getMovieSearchUrl(movie);
    const promise = await fetch(url);
    const json = await promise.json();
    return json.results;
  }

  async function handleGPTsearch(value) {
    if (!value.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await askAI(value);
      if (!result || result.length === 0) {
        setError("Couldn't get recommendations. Please try again.");
        setIsLoading(false);
        return;
      }
      const promiseArray = result.map(movie => tmdbSearch(movie));
      const movies = await Promise.all(promiseArray);
      if (movies.length !== 5) {
        setError("Unexpected results. Please try a different query.");
        setIsLoading(false);
        return;
      }
      dispatch(addGptMovies({ movieNames: result, movieResults: movies }));
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  }

  const hasResults = gptMovies && gptMovies.flat(Infinity).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black pt-28 sm:pt-32">
      {/* Hero section */}
      <div className="flex flex-col items-center px-4 pt-12 sm:pt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              AI-Powered
            </span>
            {" "}Movie Search
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            Describe what you're in the mood for and let AI find the perfect movies for you
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={e => {
          e.preventDefault();
          handleGPTsearch(searchText.current.value);
        }}
          className="w-full max-w-2xl"
        >
          <div className="flex rounded-xl overflow-hidden shadow-lg shadow-purple-900/20 border border-zinc-700 focus-within:border-purple-500 transition-colors duration-300">
            <input
              placeholder={LANGUAGE_CONSTANTS[selectedLanguage].gptSearchPlaceholder}
              className="flex-1 px-5 py-4 bg-zinc-800/80 text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base"
              ref={searchText}
            />
            <button
              disabled={isLoading}
              className="px-6 sm:px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold hover:from-purple-500 hover:to-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="hidden sm:inline">Searching...</span>
                </span>
              ) : (
                LANGUAGE_CONSTANTS[selectedLanguage].search
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/50">
            {error}
          </p>
        )}

        {/* Suggestions */}
        {!hasResults && !isLoading && (
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm mb-4">Try something like:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Sci-fi thrillers like Inception", "Feel-good comedies", "Korean horror movies", "90s Bollywood classics"].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    searchText.current.value = suggestion;
                    handleGPTsearch(suggestion);
                  }}
                  className="px-4 py-2 text-sm rounded-full border border-zinc-700 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-all duration-200 bg-zinc-800/50 hover:bg-zinc-800"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results section */}
      <div className="text-white mt-8 pb-8">
        {hasResults && gptNames.map((movie, index) => (
          <VideoList key={movie} title={movie} movies={gptMovies[index]} />
        ))}
      </div>
    </div>
  )
}

export default GptSearch