export interface VisiMisiType {
  id: number;
  slug?: string;
  title: string;
  subtitle: string;
  vs: string;
  ms: string;
  moto: string;
  titleMoto: string;
  visi: VisiType[];
  misi: MisiType[];
}

export interface VisiType {
  id: number;
  slug?: string;
  title: string;
  authId: number;
}

export interface MisiType {
  id: number;
  slug?: string;
  title: string;
  authId: number;
}
