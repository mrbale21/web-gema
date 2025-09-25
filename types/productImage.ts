import { Product } from "./products";

export type ProductImage = {
  id: number;
  name: string;
  desc?: string | null;
  image?: string | null;
  isActive: boolean;

  productId?: number | null;
  product?: Product | null;
};
