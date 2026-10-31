import { AppError } from "../utils/AppError.js";

// validate({ body: schema, query: schema, params: schema })
export const validate = (schemas) => (req, _res, next) => {
  for (const key of ["params", "query", "body"]) {
    if (!schemas[key]) continue;
    const result = schemas[key].safeParse(req[key]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      throw new AppError("Validation failed", 400, details);
    }
    // Express 5: req.query is a getter, so store parsed values separately
    if (key === "query") req.validatedQuery = result.data;
    else req[key] = result.data;
  }
  next();
};
