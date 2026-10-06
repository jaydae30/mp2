import { useParams } from 'react-router-dom'

export default function DetailPage() {
  const { id } = useParams()
  return <h1>Movie {id}</h1>
}