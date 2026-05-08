import {body} from 'express-validator';
import { asyncHandler } from '../utils/async-handler.js';
import { AvailableUserRole } from '../utils/constants.js';
const useRegisterValidator = () => {
    return [ 

        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({ min: 10, max: 20 }) 
        .withMessage("Username must be between 10 and 20 characters long"),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5 and 20 characters long"),

        body("fullname")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),

        body("email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email format"),

        
    ];
};

const userLoginValidator = () => {
    return [
        body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email"),

        body("password")
        .notEmpty()
        .withMessage("Password is required")
    ];
};

const userChangePasswordValidator = () => {
    return [
        body("oldPassword")
        .notEmpty()
        .withMessage("old password is required"),

        body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5 and 20 characters long")
    ];
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
        .notEmpty("Email is required")
        .isEmail()
        .withMessage("Email is invalid")
    ];
};

 const userResetPasswordValidator = () => {
    return[
        body("newPassword")
        .notEmpty()
        .withMessage("Password is Required")
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5 and 20 characters long")
    ];
 };

const createProjectValidator = () => {
    return [
         body("name")
        .notEmpty()
        .withMessage("Name is Required"),
  
        body("description")
        .optional()
    ];
};

const addMembertoProjectValidator = () =>
{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("required email")
        .isEmail()
        .withMessage("invalid Email"),

        body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableUserRole)
        .withMessage("Role is Invalid"),
    ];
};


export { 
  useRegisterValidator, userLoginValidator, asyncHandler,
  userChangePasswordValidator, userForgotPasswordValidator, 
  userResetPasswordValidator, createProjectValidator, 
  addMembertoProjectValidator,
};
