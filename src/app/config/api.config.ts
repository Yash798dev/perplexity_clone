import { isDevMode } from '@angular/core';
export const API_BASE_URL = isDevMode()
  ? 'http://localhost:3000'
  : 'https://perplexity-clone-backend-xvkc.onrender.com'; // <-- Make sure -xvkc is here!