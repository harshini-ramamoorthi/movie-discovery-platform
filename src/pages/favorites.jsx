import "../css/favorites.css";
import { useMovieContext } from "../context/moviecontext";
import MovieCard from "../components/MoviesCard";
import { useSearchParams } from "react-router-dom";

function Favorites() {
  const { favorites } = useMovieContext();
  const [searchParams] = useSearchParams();

  const searchQuery = (searchParams.get("search") || "").toLowerCase();

  const sortedFavorites = [...favorites].sort(
    (a, b) => b.likedAt - a.likedAt
  );

  const filteredFavorites = sortedFavorites.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery)
  );

  if (favorites.length === 0) {
    return (
      <div className="favorites empty-state">
        <h2>🎬 No Favorite Movies Yet</h2>
        <p>Start adding your favorite movies here...</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>
        Your Favorites {searchQuery && `— "${searchQuery}"`}
      </h2>

      <div className="movies-grid">
        {filteredFavorites.length > 0 ? (
          filteredFavorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))
        ) : (
          <div className="favorites-empty">
            <h2>🔍 No matching movies</h2>
            <p>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;