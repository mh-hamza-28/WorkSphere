import { ApiError } from "../utils/api-error.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const extractedErrors = result.error.issues.map((issue) => ({
      [issue.path.join(".") || "request"]: issue.message,
    }));

    throw new ApiError(422, "Validation Error", extractedErrors);
  }

  req.body = result.data.body ?? req.body;
  req.params = result.data.params ?? req.params;
  next();
};

export const validateRequest = validate;

export default validate;
