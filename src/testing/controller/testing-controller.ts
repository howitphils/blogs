import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-status-types";
import { db } from "../../db/db";

export const testingController = {
  resetDatabase: async (req: Request, res: Response) => {
    // Implementation for resetting the database
    db.blogs = [];
    db.posts = [];

    res.sendStatus(HttpStatus.NO_CONTENT);
    return;
  },
};
