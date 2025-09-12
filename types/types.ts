export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  category: string;
}

export interface FormData {
  title: string;
  content: string;
  author: string;
  status: "draft" | "published" | "archived";
  category: string;
}
