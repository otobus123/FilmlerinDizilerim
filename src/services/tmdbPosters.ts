/**
 * On-demand poster URLs from TMDB. Nothing is persisted to film records or localStorage.
 */
import type { Film } from '../types';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export function getTmdbApiKey(settingsKey?: string): string {
  const env =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_TMDB_API_KEY
      ? String(import.meta.env.VITE_TMDB_API_KEY).trim()
      : '';
  return env || (settingsKey || '').trim();
}

function posterUrl(filePath: string): string {
  if (!filePath) return '';
  return `${TMDB_IMG_BASE}${filePath}`;
}

function parseYear(y?: string): number | undefined {
  if (!y) return undefined;
  const m = String(y).match(/^(\d{4})/);
  return m ? parseInt(m[1], 10) : undefined;
}

function releaseYearFromTmdb(dateStr: string | undefined): number | undefined {
  if (!dateStr || dateStr.length < 4) return undefined;
  const y = parseInt(dateStr.slice(0, 4), 10);
  return Number.isFinite(y) ? y : undefined;
}

async function tmdbGet(path: string, apiKey: string): Promise<any> {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set('api_key', apiKey);
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(err || `TMDB HTTP ${res.status}`);
  }
  return res.json();
}

async function searchId(
  apiKey: string,
  type: 'Movie' | 'Series',
  query: string,
  preferYear?: number
): Promise<{ id: number; posterPath: string | null } | null> {
  const enc = encodeURIComponent(query);
  const endpoint = type === 'Movie' ? '/search/movie' : '/search/tv';

  const yearSuffix =
    preferYear && type === 'Movie'
      ? `&year=${preferYear}`
      : preferYear && type === 'Series'
        ? `&first_air_date_year=${preferYear}`
        : '';

  const run = async (withYear: boolean) => {
    const suffix = withYear ? yearSuffix : '';
    const data = await tmdbGet(`${endpoint}?query=${enc}${suffix}`, apiKey);
    return data.results as Array<{
      id: number;
      poster_path: string | null;
      release_date?: string;
      first_air_date?: string;
    }>;
  };

  let results = preferYear ? await run(true) : await run(false);
  if (preferYear && (!results || results.length === 0)) {
    results = await run(false);
  }
  if (!results?.length) return null;

  if (preferYear) {
    const match = results.find(r => {
      const d = type === 'Movie' ? r.release_date : r.first_air_date;
      return releaseYearFromTmdb(d) === preferYear;
    });
    if (match) return { id: match.id, posterPath: match.poster_path };
  }

  const first = results[0];
  return { id: first.id, posterPath: first.poster_path };
}

async function fetchImagePaths(
  apiKey: string,
  type: 'Movie' | 'Series',
  id: number
): Promise<string[]> {
  const path = type === 'Movie' ? `/movie/${id}/images` : `/tv/${id}/images`;
  const data = await tmdbGet(path, apiKey);
  const posters = (data.posters || []) as Array<{
    file_path: string;
    vote_average?: number;
    vote_count?: number;
  }>;
  const sorted = [...posters].sort((a, b) => {
    const vb = (b.vote_average ?? 0) - (a.vote_average ?? 0);
    if (vb !== 0) return vb;
    return (b.vote_count ?? 0) - (a.vote_count ?? 0);
  });
  const seen = new Set<string>();
  const paths: string[] = [];
  for (const p of sorted) {
    if (!p.file_path || seen.has(p.file_path)) continue;
    seen.add(p.file_path);
    paths.push(p.file_path);
    if (paths.length >= 10) break;
  }
  return paths;
}

/**
 * Returns HTTPS image URLs for display only (session memory). Max ~10 posters.
 */
export async function fetchFilmPosterUrls(apiKey: string, film: Film): Promise<string[]> {
  const year = parseYear(film.releaseYear);
  const queries = Array.from(
    new Set(
      [film.originalTitle, film.turkishTitle]
        .map(s => (s || '').trim())
        .filter(Boolean)
    )
  );

  let id: number | null = null;
  let fallbackPoster: string | null = null;

  for (const q of queries) {
    const found = await searchId(apiKey, film.type, q, year);
    if (found) {
      id = found.id;
      fallbackPoster = found.posterPath;
      break;
    }
  }

  if (id == null) return [];

  const filePaths = await fetchImagePaths(apiKey, film.type, id);
  const urls = filePaths.map(posterUrl).filter(Boolean);

  if (urls.length === 0 && fallbackPoster) {
    return [posterUrl(fallbackPoster)];
  }

  return urls;
}
