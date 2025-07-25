// Health check configuration for EasyPanel
export default {
  // Health check endpoint for the backend service
  backend: {
    // URL to check
    url: 'http://localhost:3001/health',
    // HTTP method to use
    method: 'GET',
    // Expected status code
    expectedStatus: 200,
    // Expected response body pattern (partial match)
    expectedBody: { status: 'healthy' },
    // Timeout in milliseconds
    timeout: 5000,
    // Interval between checks in milliseconds
    interval: 30000,
    // Number of retries before marking as unhealthy
    retries: 3,
    // Initial delay before starting health checks (ms)
    startPeriod: 10000,
  },
  
  // Health check endpoint for the frontend service
  frontend: {
    // URL to check
    url: 'http://localhost:80',
    // HTTP method to use
    method: 'GET',
    // Expected status code
    expectedStatus: 200,
    // Timeout in milliseconds
    timeout: 5000,
    // Interval between checks in milliseconds
    interval: 30000,
    // Number of retries before marking as unhealthy
    retries: 3,
    // Initial delay before starting health checks (ms)
    startPeriod: 10000,
  }
};
