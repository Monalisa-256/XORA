/** Immutable production identity. Runtime settings cannot redirect production to another Neon branch. */
export const productionTarget = {
  project: 'sweet-meadow-04731447',
  branch: 'br-young-hill-bgijo9jk',
  database: 'xora',
  user: 'xora_prod_web',
  hosts: [
    'ep-dark-rice-bg6gloaq-pooler.c-9.eu-central-1.aws.neon.tech',
    'ep-dark-rice-bg6gloaq.c-9.eu-central-1.aws.neon.tech',
  ],
} as const;

export function assertProductionTarget(env: Record<string, string | undefined>): void {
  const production = env.NODE_ENV === 'production' || env.VERCEL_ENV === 'production' || env.XORA_ENVIRONMENT === 'production';
  if (!production) return;
  if (env.XORA_ENVIRONMENT !== 'production' || env.VERCEL_ENV === 'preview') throw Error('PRODUCTION_ENVIRONMENT_REQUIRED');
  if (env.XORA_DATABASE_NEON_PROJECT_ID !== productionTarget.project ||
      env.XORA_DATABASE_NEON_BRANCH_ID !== productionTarget.branch ||
      env.XORA_DATABASE_NAME !== productionTarget.database ||
      env.XORA_DATABASE_ALLOWED_USER !== productionTarget.user ||
      !productionTarget.hosts.some(host => host === env.XORA_DATABASE_ALLOWED_HOST)) throw Error('PRODUCTION_DATABASE_TARGET_MISMATCH');
  if (env.XORA_TEST_ENDPOINTS === 'true') throw Error('PRODUCTION_TEST_ENDPOINTS_FORBIDDEN');
}
