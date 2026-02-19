import express from "express";
import { JwtPayloadWithUser } from "./src/core/types/jwt-payload-type";

// DON'T ACCESS req.user IN ENDPOINTS WITH NO JWTAUTH PROTECTION ADDED

declare global {
  namespace Express {
    export interface Request {
      user: JwtPayloadWithUser;
    }
  }
}
