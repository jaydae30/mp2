import { Routes, Route, Link } from 'react-router-dom'
import GalleryPage from './pages/GalleryPage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import ServicesPage from './pages/ServicesPage'

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Suggestions</Link> | <Link to="/search">Search</Link> |{' '}
        <Link to="/services">My Services</Link>
      </nav>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/search" element={<ListPage />} />
        <Route path="/movie/:id" element={<DetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </>
  )
}