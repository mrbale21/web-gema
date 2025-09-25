import { Product } from "./products";

export type ProductType = {
  id: number;
  title?: string | null;
  desc?: string | null;
  icon?: string | null;
  isActive: boolean;

  productId?: number | null;
  product?: Product | null;
};
