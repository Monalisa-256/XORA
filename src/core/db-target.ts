/** Fail closed if a DATABASE_URL points at any other Neon project/database. */
export function validateDatabaseTarget(urlString:string, expectedDatabase:string, expectedProjectId:string, expectedHost:string, expectedUser:string):void {
  const url=new URL(urlString);
  if (!['postgres:','postgresql:'].includes(url.protocol)) throw new Error('INVALID_DATABASE_SCHEME');
  if (!(url.hostname.endsWith('.neon.tech')||url.hostname.endsWith('.aws.neon.tech'))) throw new Error('DATABASE_HOST_NOT_NEON');
  if (decodeURIComponent(url.pathname.slice(1))!==expectedDatabase) throw new Error('WRONG_DATABASE_NAME');
  if (expectedProjectId!=='sweet-meadow-04731447') throw new Error('WRONG_XORA_PROJECT_ID');
  if (url.hostname!==expectedHost) throw new Error('WRONG_XORA_BRANCH_HOST');
  if (decodeURIComponent(url.username)!==expectedUser) throw new Error('UNSAFE_DATABASE_LOGIN_ROLE');
  if (url.searchParams.get('sslmode')==='disable') throw new Error('DATABASE_TLS_REQUIRED');
}
