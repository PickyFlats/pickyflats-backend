export interface JwtPayload {
  userId: string;
  email: string;
  roles: string[]; // Array of roles assigned to the user
}
