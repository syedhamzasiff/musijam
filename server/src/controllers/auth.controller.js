import prisma from '../db/prismaClient.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'

export const registerUser = asyncHandler(async (req, res) => {
    //extract data
    const { email, username, password } = req.body;

    //validate input
    if ([email, username, password].some(field => !field.trim())) {
        throw new ApiError(400, "Email, Username, and Password are required");
    }
    
    //check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });
    

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user object - entry in db
    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword
        }
    })
    
    //exclude the password before sending back the response
    const userResponse = { ...newUser, password: undefined };

    return res.status(201).json(new ApiResponse(200, userResponse, "User registered successfully"));

});

export const loginUser = asyncHandler(async (req, res) => {
    
});

export const logoutUser = asyncHandler(async (req, res) => {
    
});