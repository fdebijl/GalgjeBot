declare module 'image-downloader';

declare interface Medium2 {
  w: number;
  h: number;
  resize: string;
}

declare interface Thumb {
  w: number;
  h: number;
  resize: string;
}

declare interface Large {
  w: number;
  h: number;
  resize: string;
}

declare interface Small {
  w: number;
  h: number;
  resize: string;
}

declare interface Sizes {
  medium: Medium2;
  thumb: Thumb;
  large: Large;
  small: Small;
}

declare interface Medium {
  id: number;
  id_str: string;
  indices: number[];
  media_url: string;
  media_url_https: string;
  url: string;
  display_url: string;
  expanded_url: string;
  type: string;
  sizes: Sizes;
}

declare interface Entities {
  hashtags: any[];
  symbols: any[];
  user_mentions: any[];
  urls: any[];
  media: Medium[];
}

declare interface Medium4 {
  w: number;
  h: number;
  resize: string;
}

declare interface Thumb2 {
  w: number;
  h: number;
  resize: string;
}

declare interface Large2 {
  w: number;
  h: number;
  resize: string;
}

declare interface Small2 {
  w: number;
  h: number;
  resize: string;
}

declare interface Sizes2 {
  medium: Medium4;
  thumb: Thumb2;
  large: Large2;
  small: Small2;
}

declare interface Medium3 {
  id: any;
  id_str: string;
  indices: number[];
  media_url: string;
  media_url_https: string;
  url: string;
  display_url: string;
  expanded_url: string;
  type: string;
  sizes: Sizes2;
}

declare interface ExtendedEntities {
  media: Medium3[];
}

declare interface Description {
  urls: any[];
}

declare interface Entities2 {
  description: Description;
}

declare interface User {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url?: any;
  entities: Entities2;
  protected: boolean;
  followers_count: number;
  friends_count: number;
  listed_count: number;
  created_at: string;
  favourites_count: number;
  utc_offset?: any;
  time_zone?: any;
  geo_enabled: boolean;
  verified: boolean;
  statuses_count: number;
  lang?: any;
  contributors_enabled: boolean;
  is_translator: boolean;
  is_translation_enabled: boolean;
  profile_background_color: string;
  profile_background_image_url?: any;
  profile_background_image_url_https?: any;
  profile_background_tile: boolean;
  profile_image_url: string;
  profile_image_url_https: string;
  profile_link_color: string;
  profile_sidebar_border_color: string;
  profile_sidebar_fill_color: string;
  profile_text_color: string;
  profile_use_background_image: boolean;
  has_extended_profile: boolean;
  default_profile: boolean;
  default_profile_image: boolean;
  following: boolean;
  follow_request_sent: boolean;
  notifications: boolean;
  translator_type: string;
}

declare type ExtendedTweet = {
  created_at: string;
  id: number;
  id_str: string;
  text?: string;
  full_text: string;
  truncated: boolean;
  display_text_range: number[];
  entities: Entities;
  extended_entities: ExtendedEntities;
  source: string;
  in_reply_to_status_id?: any;
  in_reply_to_status_id_str?: any;
  in_reply_to_user_id?: any;
  in_reply_to_user_id_str?: any;
  in_reply_to_screen_name?: any;
  user: User;
  geo?: any;
  coordinates?: any;
  place?: any;
  contributors?: any;
  is_quote_status: boolean;
  retweet_count: number;
  favorite_count: number;
  favorited: boolean;
  retweeted: boolean;
  possibly_sensitive: boolean;
  possibly_sensitive_appealable: boolean;
  lang: string;
}
