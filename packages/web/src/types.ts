export interface Song {
  id: string; // YouTube video ID
  title: string;
  thumbnailUrl?: string;
  artist?: string; // Optional
  votes?: number;
}

export interface CurrentDJPlaylist {
  name: string;
  songs: Song[];
}

export interface RequestedSong extends Song {
  requestedBy?: string; // Optional, for display
}
