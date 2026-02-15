import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";

const globalRouter: Router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => globalRouter.use(route.path, route.route));

export default globalRouter;
