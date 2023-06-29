export interface JwtPayload {
  sub: string;
  userId: string;
  email: string;
  roles: string[]; // Array of roles assigned to the user
}
