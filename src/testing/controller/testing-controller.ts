import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { clearCollections } from "../../db/mongodb";

export const testingController = {
  resetDatabase: async (req: Request, res: Response) => {
    // Implementation for resetting the database
    await clearCollections();

    res.sendStatus(HttpStatus.NO_CONTENT);
    return;
  },
};
