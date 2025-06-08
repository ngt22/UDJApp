export interface Song {
  id: string; // YouTube video ID
  title: string;
  thumbnailUrl?: string; // From YouTube
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}
