globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from './chunks/index_9inaxI72.mjs';
import './chunks/astro-designed-error-pages_DfsRyqyG.mjs';

const PUBLIC_ROUTES = ["/login"];
const onRequest$2 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (PUBLIC_ROUTES.includes(pathname)) {
    return next();
  }
  const authCookie = context.cookies.get("auth");
  if (!authCookie || authCookie.value !== "authenticated") {
    return context.redirect("/login");
  }
  return next();
});

const When = {
                	Client: 'client',
                	Server: 'server',
                	Prerender: 'prerender',
                	StaticBuild: 'staticBuild',
                	DevServer: 'devServer',
              	};
            	
              const isBuildContext = Symbol.for('astro:when/buildContext');
              const whenAmI = globalThis[isBuildContext] ? When.Prerender : When.Server;

const middlewares = {
  [When.Client]: () => {
    throw new Error("Client should not run a middleware!");
  },
  [When.DevServer]: (_, next) => next(),
  [When.Server]: (_, next) => next(),
  [When.Prerender]: (ctx, next) => {
    if (ctx.locals.runtime === void 0) {
      ctx.locals.runtime = {
        env: process.env
      };
    }
    return next();
  },
  [When.StaticBuild]: (_, next) => next()
};
const onRequest$1 = middlewares[whenAmI];

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
