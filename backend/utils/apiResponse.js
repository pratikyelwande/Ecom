
export const apiResponse = {
        success: (res, data, message = 'Success', statusCode = 200) => {
            res.status(statusCode).json({
                success: true,
                message,
                data
            });
        },

        error: (res, message = 'Error occurred', statusCode = 500, errors = null) => {
            res.status(statusCode).json({
                success: false,
                message,
                errors: errors || undefined
            });
        },

    unauthorized: (res, message = 'Unauthorized') => {
        res.status(401).json({
            status: 'fail',
            message
        });
    },

    notFound: (res, message = 'Not Found') => {
        res.status(404).json({
            status: 'fail',
            message
        });
    },

    badRequest: (res, message = 'Bad Request') => {
        res.status(400).json({
            status: 'fail',
            message
        });
    },

    forbidden: (res, message = 'Forbidden') => {
        res.status(403).json({
            status: 'fail',
            message
        });
    },

    internalServerError: (res, message = 'Internal Server Error') => {
        res.status(500).json({
            status: 'error',
            message
        });
    }
};
