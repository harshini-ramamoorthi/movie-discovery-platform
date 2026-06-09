// const API_KEY = import.meta.env.VITE_API_KEY;
// const BASE_URL = "https://api.themoviedb.org/3";

// export const getPopularMovies = async (page=1) => {
//   const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
//   const data = await response.json();
//   return data.results;
// };

// export const searchMovies = async (query) => {
//   const response = await fetch(
//     `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
//   );
//   const data = await response.json();
//   return data.results;
// };


// const API_KEY = import.meta.env.VITE_API_KEY;
// const BASE_URL = "https://api.themoviedb.org/3";

// // Get popular movies (with pagination)
// export const getPopularMovies = async (page = 1) => {
//   const response = await fetch(
//     `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
//   );

//   const data = await response.json();
//   return data.results;
// };

// // 🔍 Search movies (with pagination)
// export const searchMovies = async (query, page = 1) => {
//   const response = await fetch(
//     `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
//   );

//   const data = await response.json();
//   return data.results;
// };


const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  const data = await res.json();
  return data.results || [];
};

export const searchMovies = async (query, page = 1) => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  const data = await res.json();
  return data.results || [];
};

// export const getMovieDetails = async (id) => {
//   const res = await fetch(
//     `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
//   );
//   const data = await res.json();
//   return data;
// };

export const getMovieDetails = async (id) => {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
  );
  const data = await res.json();
  return data;
};
