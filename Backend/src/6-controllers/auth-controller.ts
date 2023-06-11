import express, { NextFunction, Request, Response } from "express";
import CityModel from "../4-models/city-model";
import { CredentialsModel } from "../4-models/credentials-model";
import { UserModel } from "../4-models/user-model";
import authLogic from "../5-logic/auth-logic";

const router = express.Router();

// POST http://localhost:3001/api/auth/register
router.post("/auth/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body);
        const token = await authLogic.register(user);
        response.status(201).json(token); // status: 201 - Created
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://localhost:3001/api/auth/login
router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = new CredentialsModel(request.body);
        const token = await authLogic.login(credentials);
        response.json(token);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/auth/cities
router.get("/auth/cities", (request: Request, response: Response, next: NextFunction) => {
    try {
        const cities = CityModel; // Get all cities
        response.json(cities);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;