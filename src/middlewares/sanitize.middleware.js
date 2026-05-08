const forbiddenKeyPattern = /^\$|\.|\0/g;

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((clean, [key, nestedValue]) => {
    const safeKey = key.replace(forbiddenKeyPattern, "");
    clean[safeKey] = sanitizeValue(nestedValue);
    return clean;
  }, {});
};

export const sanitizeRequest = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);

  const sanitizedQuery = sanitizeValue(req.query);
  Object.keys(req.query).forEach((key) => delete req.query[key]);
  Object.assign(req.query, sanitizedQuery);

  next();
};
