import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import GalleryPage from './pages/GalleryPage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import ServicesPage from './pages/ServicesPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/search" element={<ListPage />} />
          <Route path="/movie/:id" element={<DetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}