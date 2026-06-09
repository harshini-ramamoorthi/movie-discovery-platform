import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {

  //Load directly during initialization (IMPORTANT)
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  //Save whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  //Add (no duplicates)
  const addToFavorite = (movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [
  { ...movie, likedAt: Date.now() },
  ...prev
];
    });
  };

  //Remove
  const removeFromFavorite = (movieId) => {
    setFavorites((prev) =>
      prev.filter((movie) => movie.id !== movieId)
    );
  };

  //Check
  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  return (
    <MovieContext.Provider
      value={{ favorites, addToFavorite, removeFromFavorite, isFavorite }}
    >
      {children}
    </MovieContext.Provider>
  );
};
