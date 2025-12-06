import { buildURLData } from 'web-utility';

const DEFAULT_HOSTS = [
  process.env.AKSHARE_API_BASE,
  'https://akshare.xyz/api/public',
  'https://akshare.akfamily.xyz/api/public',
].filter((value): value is string => !!value);

export async function requestAkShareJSON<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  let lastError: Error | null = null;

  for (const host of DEFAULT_HOSTS) {
    try {
      const url = new URL(endpoint.replace(/^\//, ''), host.endsWith('/') ? host : `${host}/`);

      if (params) url.search = buildURLData(params) + '';

      const response = await fetch(url.toString(), {
        headers: { accept: 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok)
        throw new Error(
          `AkShare responded with ${response.status} ${response.statusText} for ${url}`,
        );

      const contentType = response.headers.get('content-type');

      if (!contentType?.includes('application/json')) {
        const preview = (await response.text()).slice(0, 200);

        throw new Error(`Unexpected content-type ${contentType} for ${url}: ${preview}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error as Error;
      console.warn(`[AkShare] Falling back after error on host ${host}:`, lastError.message);
    }
  }
  throw lastError ?? new Error('AkShare request failed without specific error');
}
