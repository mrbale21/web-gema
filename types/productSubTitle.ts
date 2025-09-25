import { Product } from "./products";

export type ProductSubTitle = {
  id: number;
  title: string;
  desc?: string | null;
  isActive: boolean;

  productId: number | null;
  product?: Product | null;
};
