// ---------- Movies ----------

export type MovieSummary = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string 
  vote_average: number 
  popularity: number
  genre_ids: number[]
}

export type MovieDetails = {
  id: number
  title: string
  overview: string
  tagline: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number | null // minutes
  vote_average: number
  genres: Genre[]
}

export type PagedResponse<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// ---------- Genres ----------

export type Genre = {
  id: number
  name: string
}

export type GenreListResponse = {
  genres: Genre[]
}

// ---------- Actors ----------

export type Person = {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string 
}

// ---------- Streaming providers ----------

export type WatchProvider = {
  provider_id: number
  provider_name: string
  logo_path: string
  display_priority: number
}


export type ProviderListResponse = {
  results: WatchProvider[]
}

export type CountryProviders = {
  link: string
  flatrate?: WatchProvider[] 
  free?: WatchProvider[]
  ads?: WatchProvider[] 
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export type MovieProvidersResponse = {
  id: number
  results: Record<string, CountryProviders> 
}