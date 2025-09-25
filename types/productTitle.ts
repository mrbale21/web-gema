import { Product } from "./products";

export type ProductTitle = {
  id: number;
  title: string;
  desc?: string | null;
  isActive: boolean;

  productId: number | null;
  product?: Product | null;
};
