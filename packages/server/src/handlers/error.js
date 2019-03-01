/**
 * Create an error handler with a given logger. The error handler will interpret
 * the thrown `error` and try to construct a standard error response for the
 * service.
 */
export function createErrorHandler(logger) {
  return (error, req, res, next) => {
    const status = error.status || 500;
    const details = {
      status,
      code: error.code || 500,
      message: 'Internal server error',
    };

    if (error.public && error.message) {
      details.message = error.message;
    }

    res.status(status).json(details);
    logger.error(error);
  };
}
