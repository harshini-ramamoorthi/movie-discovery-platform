import "../css/moviecard.css";
import { useMovieContext } from "../context/moviecontext";
import { useNavigate, useLocation } from "react-router-dom";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorite, removeFromFavorite } = useMovieContext();
  const navigate = useNavigate();
  const location = useLocation();

  const favorite = movie?.id ? isFavorite(movie.id) : false;

  function onFavoriteClick(e) {
    e.stopPropagation(); // don't open details page
    if (favorite) removeFromFavorite(movie.id);
    else addToFavorite(movie);
  }

  function handleCardClick() {
    navigate(`/movie/${movie.id}`, {
      state: {
        from: location.pathname + location.search,
      },
    });
  }

  return (
    <div className="movie-card" onClick={handleCardClick}>
      
      {/* Poster */}
      <div className="movie-poster">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={movie.title || movie.name}
        />

        {/* Overlay */}
        <div className="movie-overlay">
          
          {/* Favorite button */}
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ♡
          </button>

          {/* ⭐ Hover preview */}
          <div className="hover-preview">
            <div className="rating">
              ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
            </div>

            <div className="title">
              {movie.title || movie.name}
            </div>

            <div className="overview">
              {movie.overview
                ? movie.overview.slice(0, 100) + "..."
                : "No description available"}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom info (always visible) */}
      <div className="movie-info">
        <h3>{movie.title || movie.name}</h3>
        <p>
          {(movie.release_date || movie.first_air_date)?.split("-")[0]}
        </p>
      </div>

    </div>
  );
}

export default MovieCard;