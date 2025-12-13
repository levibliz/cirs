
import { NextResponse } from 'next/server';
import { getHealthStatus } from '../../backend/services/healthService';

/**
 * Handles the health check request.
 * It calls the health service and returns the status as a JSON response.
 */
export const checkHealth = async (): Promise<NextResponse> => {
  try {
    const healthStatus = await getHealthStatus();
    return NextResponse.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
