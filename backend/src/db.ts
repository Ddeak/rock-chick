import postgres from 'postgres';

// `prepare: false` is required for Supabase's transaction-mode pooler
// (Supavisor): each statement in a transaction can land on a different
// underlying connection, so server-side prepared statements aren't safe.
export const sql = postgres(process.env.DATABASE_URL ?? '', {
  prepare: false,
});
