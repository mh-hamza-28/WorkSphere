import { ProjectMember } from '../models/projectmember.models.js';
import {User} from '../models/user.model.js';
import{ ApiError } from '../utils/api-error.js';
import {asyncHandler} from '../utils/async-handler.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const verifyJWT = asyncHandler(async (req, res, next) => 
    {
const token = req.cookies?.accessToken || 
 req.headers["authorization"]?.replace("Bearer ", "");
 
    if(!token){
        throw new ApiError(401, "Unauthorized request");
    }


    try{
       const decodedToken = jwt.verify
       (token, 
        process.env.ACCESS_TOKEN_SECRET
       );
       const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailverificationToken -emailverificationExpiry"
       );
    if(!user){
        throw new ApiError(401, "invalid access token");
    } 

    // attach the user to the request object for use in the next middleware or route handler 
    req.user = user;
    next();
}
    catch (error) {
        throw new ApiError(401, "invalid access token");
    }

});

export const validateProjectPermission = (allowedRoles) => asyncHandler(async (req, res, next) => {

    const {projectId} = req.params;

    if (!projectId) {
        throw new ApiError(400, "project id is missing");
    }

    const projectMember = await ProjectMember.findOne(
        {
project: new mongoose.Types.ObjectId(projectId),
user: new mongoose.Types.ObjectId(req.user._id)
        }
    )

        if (!projectMember) {
        throw new ApiError(400, "project member not found");
    }

    const givenRole = projectMember?.role

    req.user.role = givenRole;

   if (allowedRoles && !allowedRoles.includes(givenRole)){
        throw new ApiError(
            403, "you dont have permission"
        );
    }
    next();
});

