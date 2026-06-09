import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../css/navbar.css";
import { searchMovies } from "../services/api";

function NavBar() {
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const isSelecting = useRef(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Sync with URL on ANY page
  useEffect(() => {
    const urlQuery = searchParams.get("search") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  //Focus input
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  //Update URL globally
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (query.trim()) {
        params.set("search", query);
      }

      navigate(`${location.pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, navigate, location.pathname]);

  //Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || isSelecting.current) {
        isSelecting.current = false;
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await searchMovies(query, 1);
        setSuggestions(
          res.filter((m) => m.title).slice(0, 5)
        );
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // Close outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setShowSuggestions(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🌊 CineFlow</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>

        <button
          className="search-toggle"
          onClick={() => setShowSearch((prev) => !prev)}
        >
          🔍
        </button>
      </div>

      {showSearch && (
        <div ref={searchRef} className="search-container active">
          <div className="search-box">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              onFocus={() => query && setShowSuggestions(true)}

              //KEYBOARD NAV
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
                    setQuery(selected.title);
                  }

                  setShowSuggestions(false);
                  setActiveIndex(-1);
                }

                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
            />

            {query && (
              <span
                className="clear-btn"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                ×
              </span>
            )}

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((movie, i) => (
                  <li
                    key={movie.id}
                    className={i === activeIndex ? "active" : ""}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      isSelecting.current = true;
                      setQuery(movie.title);
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
        </div>
      )}
    </nav>
  );
}

export default NavBar;
