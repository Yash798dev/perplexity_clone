import { isDevMode } from '@angular/core';

// Set this to your deployed Render backend URL when ready
export const API_BASE_URL = isDevMode()
  ? 'http://localhost:3000'
  : 'https://perplexity-clone-backend-xvkc.onrender.com'; 
