import { sign } from 'jsonwebtoken';
/**
 *
 * @param user - user data for signing token
 * @returns token
 */
export const signAuthToken = (user: any) => {
  return sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '9days' },
  );
};
