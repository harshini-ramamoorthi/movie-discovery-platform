import MovieCard from "../components/MoviesCard";
import { useState, useEffect, useRef } from "react";
import "../css/home.css";
import { getPopularMovies, searchMovies } from "../services/api";
import { useSearchParams } from "react-router-dom";
import MovieSkeleton from "../components/MovieSkeleton";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(urlQuery);

  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // 🔥 Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const searchRef = useRef(null);
  const isSelecting = useRef(false);

  // ✅ Sync input when URL changes (Navbar ↔ Home)
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  // ✅ Reset when query changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    window.scrollTo({ top: 0 });
  }, [urlQuery]);

  // ✅ Fetch movies
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);

      try {
        let results = [];

        if (urlQuery) {
          results = await searchMovies(urlQuery, page);
        } else {
          results = await getPopularMovies(page);
        }

        if (results.length === 0) setHasMore(false);

        setMovies((prev) =>
          page === 1 ? results : [...prev, ...results]
        );

        setError(null);
      } catch {
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page, urlQuery]);

  // ✅ Debounce → update URL (single source of truth)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        setSearchParams({ search: inputValue });
      } else {
        setSearchParams({});
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // 🔥 Suggestions (with selection guard)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!isFocused || !inputValue.trim() || isSelecting.current) {
        isSelecting.current = false;
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await searchMovies(inputValue, 1);

        const filtered = res
          .filter((m) => m.title && m.title.length > 2)
          .slice(0, 5);

        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [inputValue, isFocused]);

  // 🔥 Reset active index
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // ✅ Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100;

      if (bottom && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // ✅ Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="home">
      <h3 className="home-title">
        🌊 CineFlow — Discover Your Next Favorite Movie
      </h3>

      {/* 🔍 SEARCH */}
      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <div className="search-box" ref={searchRef}>
          <input
            type="text"
            className="search-input"
            placeholder="Search for movies"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              inputValue && setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}

            // 🔥 KEYBOARD NAVIGATION
            onKeyDown={(e) => {
              if (!showSuggestions) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) =>
                  prev < suggestions.length - 1 ? prev + 1 : 0
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) =>
                  prev > 0 ? prev - 1 : suggestions.length - 1
                );
              }

              if (e.key === "Enter") {
                e.preventDefault();

                if (activeIndex >= 0) {
                  const selected = suggestions[activeIndex];
                  isSelecting.current = true;

                  setInputValue(selected.title);
                  setSearchParams({ search: selected.title });
                }

                setShowSuggestions(false);
                setActiveIndex(-1);
              }

              if (e.key === "Escape") {
                setShowSuggestions(false);
                setActiveIndex(-1);
              }
            }}
          />

          {/* ❌ Clear */}
          {inputValue && (
            <span
              className="clear-btn"
              onClick={() => {
                setInputValue("");
                setSearchParams({});
                setSuggestions([]);
                setShowSuggestions(false);
              }}
            >
              ×
            </span>
          )}

          {/* 🎯 Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((movie, i) => (
                <li
                  key={movie.id}
                  className={i === activeIndex ? "active" : ""}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    isSelecting.current = true;

                    setInputValue(movie.title);
                    setSearchParams({ search: movie.title });

                    setShowSuggestions(false);
                    setActiveIndex(-1);
                  }}
                >
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      {/* ❌ Error */}
      {error && <div className="error-message">{error}</div>}

      {/* ⏳ Skeleton */}
      {loading && movies.length === 0 && (
        <div className="movies-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 🎬 Movies */}
      {movies.length > 0 && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}

      {/* 🚫 No results */}
      {!loading && movies.length === 0 && urlQuery && (
        <div className="no-results">
          🔍😕 No results found for "{urlQuery}"
        </div>
      )}

      {/* ⏳ Load more */}
      {loading && movies.length > 0 && (
        <div className="loading">Loading more...</div>
      )}

      {/* 🎬 End */}
      {!loading && movies.length > 0 && !hasMore && (
        <div className="no-more">🎬 You've reached the end</div>
      )}
    </div>
  );
}

export default Home;