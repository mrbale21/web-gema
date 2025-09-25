import { Product } from "./products";

export type ProductBenefit = {
  id: number;
  slug?: string | null;
  title: string;
  isActive: boolean;

  productId?: number | null;
  product?: Product | null;
};
