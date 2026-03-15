import React, { useMemo, useState } from 'react';
import { useQuery } from '../hooks/useQuery';
import { getBooks, removeBook } from '../services/bookService';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const genres = useMemo(() => ['Fiction', 'Dystopian', 'Biography', 'History', 'Romance', 'Technology'], []);

  const fetchBooks = async (_page = 1) => {
    setLoading(true);
    try {
      const res = await getBooks({ page: _page - 1, size: 8, search: query, genre });
      const content = res.data.content || res.data;
      setBooks(content);
      setTotalPages(res.data.totalPages || 1);
      setPage(_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useQuery(() => fetchBooks(page), [query, genre]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await removeBook(id);
      toast.success('Book deleted');
      fetchBooks(page);
    } catch (err) {
      console.error(err);
      toast.error('Unable to delete');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Book catalog</h1>
      </div>
      <SearchBar query={query} onQueryChange={setQuery} genre={genre} onGenreChange={setGenre} genres={genres} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onDelete={user?.role === 'ROLE_ADMIN' ? handleDelete : undefined} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={fetchBooks} />
        </>
      )}
    </div>
  );
}
