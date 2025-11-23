// backend/middleware/errorMiddleware.js

// Middleware xử lý 404 - Not Found
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Middleware xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
    // Nếu status code là 200 nhưng có lỗi, đổi thành 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);

    // Cấu trúc response lỗi
    const errorResponse = {
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    };

    // Xử lý các loại lỗi cụ thể

    // Prisma errors
    if (err.code) {
        switch (err.code) {
            case 'P2002':
                errorResponse.message = 'Dữ liệu đã tồn tại';
                res.status(400);
                break;
            case 'P2025':
                errorResponse.message = 'Không tìm thấy dữ liệu';
                res.status(404);
                break;
            case 'P2003':
                errorResponse.message = 'Tham chiếu không hợp lệ';
                res.status(400);
                break;
            case 'P2014':
                errorResponse.message = 'Vi phạm ràng buộc dữ liệu';
                res.status(400);
                break;
        }
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        errorResponse.message = 'Token không hợp lệ';
        res.status(401);
    }

    if (err.name === 'TokenExpiredError') {
        errorResponse.message = 'Token đã hết hạn';
        res.status(401);
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        errorResponse.message = 'Dữ liệu không hợp lệ';
        errorResponse.errors = err.errors;
        res.status(400);
    }

    // Mongoose CastError
    if (err.name === 'CastError') {
        errorResponse.message = 'ID không hợp lệ';
        res.status(400);
    }

    // Log error trong development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
            name: err.name
        });
    }

    res.json(errorResponse);
};

// Middleware xử lý lỗi async
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom Error Classes
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}

module.exports = {
    notFound,
    errorHandler,
    asyncHandler,
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError
};