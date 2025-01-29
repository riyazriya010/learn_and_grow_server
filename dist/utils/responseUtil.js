"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = exports.SuccessResponse = void 0;
const SuccessResponse = (res, statusCode, message, data, accessToken, refreshToken) => {
    let response = {
        message,
        success: true,
        result: data
    };
    if (accessToken && refreshToken) {
        res
            .status(statusCode)
            .cookie('accessToken', accessToken, { httpOnly: false })
            .cookie('refreshToken', refreshToken, { httpOnly: true })
            .send(response);
    }
    else {
        res.status(statusCode).send(response);
    }
};
exports.SuccessResponse = SuccessResponse;
// Error Response
const ErrorResponse = (res, statusCode, message) => {
    const response = {
        message,
        success: false
    };
    res
        .status(statusCode).send(response);
};
exports.ErrorResponse = ErrorResponse;
