export interface comment {
  id: string;
  comment: string;
  file: { fileId: string };
  userId: string;

  createdAt: string;
}
