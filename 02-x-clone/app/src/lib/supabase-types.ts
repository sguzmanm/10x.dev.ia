export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      follows: {
        Row: {
          created_at: string;
          followee_id: string;
          follower_id: string;
        };
        Insert: {
          created_at?: string;
          followee_id: string;
          follower_id: string;
        };
        Update: {
          created_at?: string;
          followee_id?: string;
          follower_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          updated_at: string;
          user_id: string;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name: string;
          updated_at?: string;
          user_id: string;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string;
          updated_at?: string;
          user_id?: string;
          username?: string;
        };
        Relationships: [];
      };
      tweets: {
        Row: {
          author_id: string;
          body: string;
          created_at: string;
          id: string;
          parent_tweet_id: string | null;
          root_tweet_id: string;
        };
        Insert: {
          author_id: string;
          body: string;
          created_at?: string;
          id?: string;
          parent_tweet_id?: string | null;
          root_tweet_id?: string;
        };
        Update: {
          author_id?: string;
          body?: string;
          created_at?: string;
          id?: string;
          parent_tweet_id?: string | null;
          root_tweet_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      mutual_friends: {
        Row: {
          friend_id: string | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
