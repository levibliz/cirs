
/**
 * Retrieves the health status of the application.
 * In a real-world scenario, this could check database connections,
 * external services, etc.
 */
export const getHealthStatus = async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
};
