import { Elysia } from "elysia";

export const dashboardAuthMiddleware = new Elysia()
  .derive(({ headers }) => {
    // Simple basic auth for dashboard access
    // In production, you might want to use a more sophisticated auth method
    const authHeader = headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return { isAuthorized: false };
    }
    
    try {
      const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
      const [username, password] = credentials.split(':');
      
      // Check against environment variables or use default values
      const validUsername = process.env.DASHBOARD_USERNAME || 'admin';
      const validPassword = process.env.DASHBOARD_PASSWORD || 'password';
      
      return { 
        isAuthorized: username === validUsername && password === validPassword 
      };
    } catch {
      return { isAuthorized: false };
    }
  })
  .onBeforeHandle(({ isAuthorized, set }) => {
    if (!isAuthorized) {
      set.status = 401;
      set.headers['WWW-Authenticate'] = 'Basic realm="Bull Dashboard"';
      return {
        error: 'Unauthorized',
        message: 'Please provide valid credentials to access the dashboard'
      };
    }
  });