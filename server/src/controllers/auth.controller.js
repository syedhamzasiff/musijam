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
    // Extract data from request
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Create JWT token
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, isPremium: user.isPremium },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Exclude the password before sending back the response
    const userResponse = { ...user, password: undefined };

    // Set the token in the response cookie (optional) and send back response
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json(new ApiResponse(200, userResponse, "Login successful"));
});

export const logoutUser = asyncHandler(async (req, res) => {
    // Clear the access token from the cookies
    res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Send success response
    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});
