import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const userValidationSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d+$/).required(),
    password: Joi.string().min(6).required(),
});

export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = userValidationSchema.validate(req.body);

    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return; // Stop execution if validation fails
    }

    next(); // Proceed to the next middleware or route handler
};

