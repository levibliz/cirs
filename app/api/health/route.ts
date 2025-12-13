
import { checkHealth } from '../../../backend/controllers/healthController';
import { type NextRequest } from 'next/server';

/**
 * GET handler for the /api/health endpoint.
 */
export async function GET(req: NextRequest) {
  return checkHealth();
}
