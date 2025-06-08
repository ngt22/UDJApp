export interface Song {
  id: string; // YouTube video ID
  title: string;
  thumbnailUrl?: string;
  // Add any other relevant song metadata from YouTube
}

export interface Playlist {
  userId: string; // PK will be USER#<userId>
  playlistId: string; // SK will be PLAYLIST#<playlistId>
  name: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

// Example structure for DynamoDB items (simplified)
// For a user's profile: PK: USER#<userId>, SK: PROFILE
// For a playlist: PK: USER#<userId>, SK: PLAYLIST#<playlistId>
// For all playlists of a user: Query PK=USER#<userId>, SK begins_with(PLAYLIST#)

export interface UserProfile {
    userId: string; // PK: USER#<userId>, SK: PROFILE
    username: string;
    email: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}
