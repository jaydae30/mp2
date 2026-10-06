import { Routes, Route, Link } from 'react-router-dom'
import ListPage from './pages/ListPage'
import GalleryPage from './pages/GalleryPage'
import DetailPage from './pages/DetailPage'

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Search</Link> | <Link to="/gallery">Gallery</Link> |{' '}
        <Link to="/movie/550">Test movie</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/movie/:id" element={<DetailPage />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </>
  )
}