export interface CommentType {
  id: number;
  name: string;
  slug?: string;
  comment: string;
  status?: string;
  createdAt: string;
  newsId: number;
}
