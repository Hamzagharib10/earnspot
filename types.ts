export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  downloads: string;
  platform: 'Android' | 'iOS' | 'Both';
  category: string;
  tags: string[];
}

export interface SiteConfig {
  siteName: string;
  lockerUrl: string; // The link to OGAds or any other locker
  heroSubtitle: string;
  adsterraKey: string; // New field for Adsterra
}
