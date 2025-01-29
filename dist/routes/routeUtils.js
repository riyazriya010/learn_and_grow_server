"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const registerRoutes = (router, routes) => {
    routes.forEach(({ method, path, middlewares, handler }) => {
        router[method](path, ...middlewares, handler);
    });
};
exports.registerRoutes = registerRoutes;
