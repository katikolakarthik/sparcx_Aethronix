import path from 'path';

/** Vercel serverless only allows reliable writes under /tmp. */
export function useServerlessUploads() {
  return process.env.VERCEL === '1';
}

export function getUploadsRoot() {
  return useServerlessUploads()
    ? path.join('/tmp', 'uploads')
    : path.join(process.cwd(), 'uploads');
}

export function getDiseaseUploadDir() {
  return path.join(getUploadsRoot(), 'disease');
}
