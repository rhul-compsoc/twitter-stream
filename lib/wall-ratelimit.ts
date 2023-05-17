import { NextApiRequest } from 'next'
import { initRateLimit, CountFn } from './ratelimit'
import { upstashRest } from './upstash'

/**
 * Helper function for getting a specific cookie value
 * @param name identifier of the cookie
 * @param cookies list of cookies to parse
 * @returns value of the cookie
 */
const getCookie = function (name: string, cookies: string) {
  let filtered = RegExp(`${name}=[^;]+`).exec(cookies);

  return decodeURIComponent(!!filtered ? filtered.toString().replace(/^[^=]+./, "") : "");
}

export default function getId(request: NextApiRequest) {
  let xff = getCookie("id", request.headers.cookie ?? "");

  if (!xff) xff = request.socket.remoteAddress ?? '127.0.0.1';

  return xff
}

export const idRateLimit = initRateLimit((request) => ({
  id: `id:${getId(request)}`,
  count: increment,
  limit: 5,
  timeframe: 15,
}))

const increment: CountFn = async ({ response, key, timeframe }) => {
  // Latency logging
  const start = Date.now()

  const results = await upstashRest(
    [
      ['INCR', key],
      ['EXPIRE', key, timeframe],
    ],
    { pipeline: true }
  )

  // Temporal logging
  const latency = Date.now() - start
  response.headers.set('x-upstash-latency', `${latency}`)

  return results[0].result
}