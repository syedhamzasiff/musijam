import jwt from 'jsonwebtoken';
import prisma from '../db/prismaClient.js'; 
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request"); // If no token found
        }

        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user associated with the token
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            select: { id: true, username: true, email: true, isPremium: true } // Fetching necessary fields
        });

        if (!user) {
            throw new ApiError(401, "Invalid Access Token"); // If user not found
        }

        // Attach the user to the request object for further middleware or controllers
        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, error.message || "Invalid access token")); // Handle invalid token errors
    }
});
