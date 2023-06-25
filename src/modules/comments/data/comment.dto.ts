export interface commentDTO {
  id: string;
  userId: string;
  listingId: string;
  text: string;
  file: { fileId: string };
}
