export function getJwtSecret(): string {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key is not defined in environment variables.");
  }
  return process.env.JWT_SECRET_KEY;
}