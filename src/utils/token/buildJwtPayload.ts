export function buildJwtPayload(credential: {
  id: string;
  email: string;
  role: string;
}) {
  return { id: credential.id, role: credential.role, email: credential.email };
}
