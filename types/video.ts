export interface VideoType {
  id: number;
  name: string;
  videoUrl?: string;
  type: "YOUTUBE" | "LOCAL";
  createdAt: string;
}
