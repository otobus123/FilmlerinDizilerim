export type FilmStatus = 'Upcoming' | 'Watched';

export interface EpisodeWatchedDate {
  episodeNumber: number;
  seasonNumber: number;
  date: string;
}

export interface Film {
  id: string;
  type: 'Movie' | 'Series';
  status: FilmStatus;
  originalTitle: string;
  turkishTitle: string;
  releaseYear?: string;
  releaseDate?: string;
  plannedWatchDate?: string;
  watchedDate?: string;
  companions: string[]; // Changed to array
  category: string; // New field
  plot: string;
  actors: string;
  imdbRating?: string; // New field
  trailerLink?: string; // New field
  seasons?: number; // New field for series
  totalEpisodes?: number; // New field for series
  episodeWatchedDates?: EpisodeWatchedDate[]; // New field for series
  rating?: number;
  notes?: string;
  createdAt: string;
}

export interface AppSettings {
  categories: string[];
  companions: string[];
  apiKeys: string[];
  activeKeyIndex: number;
  smtpSettings?: {
    host: string;
    port: string;
    user: string;
    pass: string;
    fromEmail: string;
    toEmail: string;
  };
}

export interface User {
  email: string;
  username: string;
}
