import { ProductBenefit } from "./productBenefit";
import { ProductImage } from "./productImage";
import { ProductSubTitle } from "./productSubTitle";
import { ProductSuperior } from "./productSuperior";
import { ProductTitle } from "./productTitle";
import { ProductType } from "./productType";

export type Product = {
  id: number;
  name: string;
  desc: string;
  link?: string | null;
  image?: string | null;
  slug: string;
  isActive: boolean;

  titles?: ProductTitle[];
  subTitles?: ProductSubTitle[];
  superiors?: ProductSuperior[];
  types?: ProductType[];
  images?: ProductImage[];
  benefits?: ProductBenefit[];
};
