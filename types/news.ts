export type NewsVisibility = "HEADLINE" | "ALL" | "HIDDEN";

export interface NewsType {
  id: number;
  title: string;
  slug?: string | null;
  content: string;
  image?: string | null;
  tag?: string | null;
  editor?: string | null;
  createdAt: string;
  updatedAt: string;

  categoryId?: number | null;
  category?: {
    id: number;
    name: string;
    slug?: string | null;
  } | null;

  visibility: NewsVisibility;
}
