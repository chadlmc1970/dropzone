import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Track } from '../types';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          // Optionally redirect to login
        }
        return Promise.reject(error);
      }
    );
  }

  // Track search
  async searchTracks(query: string) {
    return this.client.get<{ tracks: Track[] }>('/api/tracks/search', {
      params: { q: query },
    });
  }

  // Get track details
  async getTrack(trackId: string) {
    return this.client.get<Track>(`/api/tracks/${trackId}`);
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.client.post('/api/auth/login', { username, password });
  }

  async logout() {
    return this.client.post('/api/auth/logout');
  }

  // User playlists
  async getPlaylists() {
    return this.client.get('/api/playlists');
  }

  async getPlaylist(playlistId: string) {
    return this.client.get(`/api/playlists/${playlistId}`);
  }
}

export default new APIClient();
