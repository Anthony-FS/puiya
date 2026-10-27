import type { APIGatewayProxyResultV2 } from 'aws-lambda'

/**
 * Public health check behind a Lambda function URL. It proves a deploy worked and returns
 * nothing about shops or people.
 */
export async function handler(): Promise<APIGatewayProxyResultV2> {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify({
      status: 'ok',
      service: 'puiya-api',
      stage: process.env.STAGE ?? 'unknown',
      time: new Date().toISOString(),
    }),
  }
}
