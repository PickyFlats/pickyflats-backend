export interface comment {
  userId: string;
  id: string;
  text: string;
  file: { fileId: string };

  createdAt: string;
}
