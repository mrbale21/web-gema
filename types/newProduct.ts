export interface NewProductImage {
  id: number;
  name: string | null;
  desc: string | null;
  image: string | null;
}

export interface NewProductDetail {
  id: number;
  title: string | null;
  desc: string | null;
  icon: string | null;
}

export interface Product {
  id: number;
  name: string;
  desc: string;
  link: string;
  image?: string | null;
  createdAt: string;
}
