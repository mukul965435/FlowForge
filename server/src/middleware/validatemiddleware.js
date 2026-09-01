import AppError from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error.errors) {
      const formattedMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");
      return next(new AppError(formattedMessage, 400, "INVALID_INPUT"));
    }
    next(error);
  }
};
