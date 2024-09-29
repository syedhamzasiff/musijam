import prisma from '../db/prismaClient.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        
        // Find the user in the database using Prisma
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            console.log("User not found for ID:", userId);
            throw new ApiError(404, "User not found");
        }

        // Log the secrets
        //console.log("Access Token Secret:", process.env.ACCESS_TOKEN_SECRET);
        //console.log("Refresh Token Secret:", process.env.REFRESH_TOKEN_SECRET);

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Update the user with the new refresh token
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }  // Save refreshToken to the database
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error); // Log the entire error object
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};


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
    // Exclude the password before sending back the response
    const userResponse = await prisma.user.findUnique({
        where: { id: newUser.id },
        select: { id: true, email: true, username: true, isPremium: true }
    });

    return res.status(201).json(new ApiResponse(200, userResponse, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { emailOrUsername, password } = req.body;

    // Validate input
    if (!emailOrUsername) {
        throw new ApiError(400, "Username or email is required");
    }

    // Determine if the input is an email or username
    const isEmail = emailOrUsername.includes('@'); // Simple check for email format
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: isEmail ? emailOrUsername : undefined },
                { username: isEmail ? undefined : emailOrUsername }
            ]
        }
    });

    // Check if user exists
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

    // Exclude password and refreshToken from the user response
    const loggedInUser = {
        ...user,
        password: undefined, // Remove password from response
        refreshToken: undefined, // Remove refreshToken from response
    };

    // Set options for cookies
    const cookieOptions = {
        httpOnly: true,
        secure: true, // Ensure it's only sent over HTTPS
        sameSite: 'strict', // Restrict cookie sharing across sites
    };

    // Set expiration for cookies to match token lifespan
    const accessTokenOptions = { ...cookieOptions, maxAge: 15 * 60 * 1000 }; // 15 minutes
    const refreshTokenOptions = { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }; // 7 days

    // Send response with cookies and user data
    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});


export const logoutUser = asyncHandler(async (req, res) => {
    // Update the user in the database, removing the refreshToken field
    await prisma.user.update({
        where: { id: req.user.id }, // use req.user.id from verified JWT
        data: {
            refreshToken: null, // this removes the refreshToken
        }
    });

    // Clear cookies for accessToken and refreshToken
    const options = {
        httpOnly: true,
        secure: true, // Ensure it's only sent over HTTPS
        sameSite: 'strict', // Ensures the cookies are only sent on same-site requests
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, username: true, email: true, isPremium: true }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { username, email, profilePicture } = req.body;

    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { username, email, profilePicture }
    });

    return res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        throw new ApiError(401, "Incorrect old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedNewPassword }
    });

    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //TODO: Token generation and email sending logic would go here...

    return res.status(200).json(new ApiResponse(200, {}, "Password reset email sent"));
});

export const deleteUserAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;

    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, "Incorrect password");
    }

    await prisma.user.delete({ where: { id: req.user.id } });

    return res.status(200).json(new ApiResponse(200, {}, "Account deleted successfully"));
});
