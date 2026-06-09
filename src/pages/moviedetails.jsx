import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/moviedetails.css";

const API_KEY = import.meta.env.VITE_API_KEY;

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  //Scroll to top when new movie loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Movie details
        const res1 = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        const data1 = await res1.json();
        setMovie(data1);

        //Trailer
        const res2 = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );
        const data2 = await res2.json();

        const trailer = data2.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);

        //Recommendations
        const res3 = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`
        );
        const data3 = await res3.json();
        setRecommendations(data3.results || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  //ESC to close trailer
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowTrailer(false);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!movie) return <div className="loading">Loading...</div>;

  return (
    <div className="details-page">

      {/*Back */}
      <button
        className="back-btn"
        onClick={() => {
          if (location.state?.from) {
            navigate(location.state.from);
          } else {
            navigate("/");
          }
        }}
      >
        ← Back
      </button>

      {/*Background (safe fallback) */}
      <div
        className="backdrop"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      />

      <div className="overlay" />

      {/*Content */}
      <div className="details-content">
        <img
          className="poster"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750"
          }
          alt={movie.title}
        />

        <div className="info">
          <h1>{movie.title}</h1>

          {movie.tagline && (
            <p className="tagline">✨ {movie.tagline}</p>
          )}

          <p className="overview">
            ⭐ <strong>{movie.vote_average?.toFixed(1)}</strong>
            <br /><br />
            {movie.overview || "No description available."}
          </p>

          {trailerKey && (
            <button
              className="trailer-btn"
              onClick={() => setShowTrailer(true)}
            >
              ▶ Play Trailer
            </button>
          )}
        </div>
      </div>

      {/*Trailer Modal */}
      {showTrailer && (
        <div
          className="trailer-modal"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="trailer-container"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/*Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2>🎬 You may also like</h2>

          <div className="recommendation-grid">
            {recommendations.slice(0, 10).map((m) => (
              <div
                key={m.id}
                className="recommendation-card"
                onClick={() =>
                  navigate(`/movie/${m.id}`, {
                    state: {
                      from: location.pathname,
                    },
                  })
                }
              >
                <img
                  src={
                    m.poster_path
                      ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                      : "https://via.placeholder.com/300x450"
                  }
                  alt={m.title}
                />
                <p>{m.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
