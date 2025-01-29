import { Router, RequestHandler } from "express";

export interface RouteConfig {
  method: "get" | "post" | "patch" | "put" | "delete";
  path: string;
  middlewares: RequestHandler[];
  handler: RequestHandler;
}

export const registerRoutes = (router: Router, routes: RouteConfig[]) => {
  routes.forEach(({ method, path, middlewares, handler }) => {
    router[method](path, ...middlewares, handler);
  });
};
