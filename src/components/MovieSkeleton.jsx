import "../css/skeleton.css";

function MovieSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster"></div>

      <div className="skeleton-text"></div>
      <div className="skeleton-text small"></div>
    </div>
  );
}

export default MovieSkeleton;