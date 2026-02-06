import * as express from "express";

// DON'T ACCESS USER PROPERTY OF REQ IN ENDPOINTS WITH NO JWTAUTH PROTECTION ADDED

declare global {
  namespace Express {
    export interface Request {
      user: {
        userId: string;
      };
    }
  }
}
