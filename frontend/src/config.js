export const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.vercel.app/api/v1'  // Replace with your actual backend URL
  : 'http://localhost:3000/api/v1'; 