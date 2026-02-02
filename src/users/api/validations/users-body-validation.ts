import { body } from "express-validator";
import { userInputRestrictions } from "./users-input-restricitions";

export const validateUserBody = [
  body("login")
    .exists()
    .withMessage("Login is required")
    .isString()
    .trim()
    .withMessage("Login must be a string")
    .matches(userInputRestrictions.login.pattern)
    .withMessage("Incorrect symbols were used")
    .isLength({
      min: userInputRestrictions.login.minLength,
      max: userInputRestrictions.login.maxLength,
    })
    .withMessage(
      `Login must be between ${userInputRestrictions.login.minLength} and ${userInputRestrictions.login.maxLength} characters`,
    ),

  body("email")
    .exists()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .trim()
    .notEmpty()
    .withMessage("Email must be not empty")
    .isLength({
      max: userInputRestrictions.email.maxLength,
    })
    .withMessage(`Email is too long`)
    .isEmail()
    .withMessage("Incorrect email"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .trim()
    .isLength({
      min: userInputRestrictions.password.minLength,
      max: userInputRestrictions.password.maxLength,
    })
    .withMessage(
      `Password must be between ${userInputRestrictions.password.minLength} and ${userInputRestrictions.password.maxLength} characters`,
    ),
];
