import React from 'react';

export default function SearchBar({ query, onQueryChange, genre, onGenreChange, genres }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between max-w-4xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search books by title..."
        className="border rounded-lg px-4 py-2 w-full sm:w-72"
      />
      <select value={genre} onChange={(e) => onGenreChange(e.target.value)} className="border rounded-lg px-4 py-2 w-full sm:w-56">
        <option value="">All Genres</option>
        {genres.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}
