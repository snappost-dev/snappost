import { defineMiddleware } from 'astro:middleware';

const PUBLIC_ROUTES = ['/login'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // Public route ise auth check'siz geç
  if (PUBLIC_ROUTES.includes(pathname)) {
    return next();
  }
  
  // Cookie kontrolü
  const authCookie = context.cookies.get('auth');
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    return context.redirect('/login');
  }
  
  return next();
});
