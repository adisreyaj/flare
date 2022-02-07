export interface JWTPayload {
  sub: string;
  email: string;
}

export enum AuthProvider {
  Google = 'google',
  Github = 'github',
}
