import { Product } from "./products";

export type ProductSuperior = {
  id: number;
  title: string;
  desc?: string | null;
  icon?: string | null;
  isActive: boolean;

  productId?: number | null;
  product?: Product | null;
};
