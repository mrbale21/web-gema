export interface GemaUMKM {
  id: number;
  slug?: string | null;
  title: string;
  desc: string;
}

export interface GemaImgUMKM {
  id: number;
  name: string;
  desc: string;
  image?: string | null;
}

export interface GemaUMKMDetail {
  id: number;
  slug?: string | null;
  title: string;
  desc: string;
  icon: string;
}
