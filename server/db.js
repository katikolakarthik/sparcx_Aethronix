import mongoose from 'mongoose';

/**
 * Reuse one connection across serverless invocations (Vercel / Lambda style).
 */
export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const e = new Error('Missing MONGODB_URI');
    e.code = 'CONFIG';
    throw e;
  }
  if (!process.env.JWT_SECRET) {
    const e = new Error('Missing JWT_SECRET');
    e.code = 'CONFIG';
    throw e;
  }

  const g = globalThis;
  if (!g.__mongooseConn) {
    g.__mongooseConn = { conn: null, promise: null };
  }
  const c = g.__mongooseConn;

  if (c.conn) return c.conn;

  if (!c.promise) {
    c.promise = mongoose.connect(uri, { maxPoolSize: 10 }).then(() => mongoose.connection);
  }
  c.conn = await c.promise;
  return c.conn;
}
