import { Router } from "express";

import auth from "./middleware/auth";
import { errorWrapper } from "./middleware/errors";
import { BadRequest, NotFound } from "./middleware/errors";

import { Role } from "../types/enums";

import type { Request, Query, Params } from "../types/post";
import type { ConventionPostBody } from "../types/convention";
import type { PrismaClient } from "@prisma/client";
import type { Response } from "express";
import type { GetParams } from "../types/convention";

export default class Convention {
  router: Router;
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.prisma = prisma;
  }
  setup(): Router {
    this.router.get(
      "/list",
      errorWrapper(async (_req: Request, res: Response) => {
        const list = await this.prisma.convention.findMany({
          where: {
            concluded: false,
          },
          select: {
            name: true,
            createdAt: true,
            roomsOpen: true,
          },
        });
        res.status(200).json({ conventions: list });
      })
    );
    this.router.get(
      "/name/:name",
      errorWrapper(
        async (req: Request<Body, Query, GetParams>, res: Response) => {
          if (!req.params || !req.params.name) {
            throw new BadRequest("Missing 'name'!");
          }
          const convention = await this.prisma.convention.findUnique({
            where: {
              name: req.params.name,
            },
            select: {
              name: true,
              createdAt: true,
              roomsOpen: true,
            },
          });
          if (!convention) throw new NotFound("No convention found!");
          res.status(200).json({ convention: convention });
        }
      )
    );
    this.router.post(
      "",
      errorWrapper(
        async (
          req: Request<ConventionPostBody, Query, Params>,
          res: Response
        ) => {
          if (
            !req.body.name ||
            req.body.name.length > 72 ||
            req.body.name.length < 1
          ) {
            throw new BadRequest(
              "Name 'name' is required, between 1-72 characters"
            );
          }
          const convention = await this.prisma.convention.create({
            data: {
              name: req.body.name,
            },
            select: {
              name: true,
            },
          });
          return res.status(201).json(convention);
        }
      )
    );
    return this.router;
  }
}
