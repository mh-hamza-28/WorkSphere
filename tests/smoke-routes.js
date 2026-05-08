process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";

const { default: app } = await import("../src/app.js");

const server = app.listen(0);
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}/api/v1`;

const checks = [
  ["GET", "/healthcheck"],
  ["GET", "/auth/test"],
  ["POST", "/auth/login"],
  ["POST", "/auth/register"],
  ["POST", "/auth/resend-email-verification"],
  ["POST", "/auth/forgot-password"],
  ["POST", "/auth/reset-password/badtoken"],
  ["POST", "/auth/refresh-token"],
  ["POST", "/auth/logout"],
  ["POST", "/auth/current-user"],
  ["POST", "/auth/change-password"],
  ["GET", "/projects"],
  ["POST", "/projects"],
  ["GET", "/projects/507f1f77bcf86cd799439011"],
  ["PUT", "/projects/507f1f77bcf86cd799439011"],
  ["DELETE", "/projects/507f1f77bcf86cd799439011"],
  ["GET", "/projects/507f1f77bcf86cd799439011/members"],
  ["POST", "/projects/507f1f77bcf86cd799439011/members"],
  ["PUT", "/projects/507f1f77bcf86cd799439011/members/507f1f77bcf86cd799439012"],
  ["DELETE", "/projects/507f1f77bcf86cd799439011/members/507f1f77bcf86cd799439012"],
  ["GET", "/tasks/project/507f1f77bcf86cd799439011"],
  ["POST", "/tasks/project/507f1f77bcf86cd799439011"],
  ["PUT", "/tasks/507f1f77bcf86cd799439013"],
  ["DELETE", "/tasks/507f1f77bcf86cd799439013"],
  ["PATCH", "/tasks/507f1f77bcf86cd799439013/assign"],
  ["PATCH", "/tasks/507f1f77bcf86cd799439013/status"],
  ["POST", "/tasks/507f1f77bcf86cd799439013/subtasks"],
  ["PUT", "/tasks/subtasks/507f1f77bcf86cd799439014"],
  ["DELETE", "/tasks/subtasks/507f1f77bcf86cd799439014"],
  ["PATCH", "/tasks/subtasks/507f1f77bcf86cd799439014/status"],
  ["GET", "/notifications"],
  ["PATCH", "/notifications/read-all"],
  ["PATCH", "/notifications/507f1f77bcf86cd799439015/read"],
  ["POST", "/notifications/507f1f77bcf86cd799439015/respond"],
];

try {
  const failures = [];

  for (const [method, path] of checks) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { "content-type": "application/json" },
      body: ["POST", "PUT", "PATCH"].includes(method)
        ? JSON.stringify({})
        : undefined,
    });

    const isRouteFailure =
      response.status === 404 ||
      response.status === 405 ||
      response.status >= 500;

    if (isRouteFailure) {
      failures.push(`${method} ${path} -> ${response.status}`);
    }
  }

  if (failures.length) {
    console.error(`Route smoke test failed:\n${failures.join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log(`Route smoke test passed: ${checks.length} endpoints reached handlers.`);
  }
} finally {
  server.close();
}
