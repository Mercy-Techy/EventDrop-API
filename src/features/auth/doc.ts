import docFormatter from "../../swagger/docFormatter";

export const authDocs = {
  "/auth/signup": docFormatter("post", "Auth", "Sign up", false, [], null, {
    firstname: { type: "string", example: "Tony" },
    lastname: { type: "string", example: "White" },
    email: { type: "string", example: "tonywhite@gmail.com" },
    password: { type: "string", example: "User1234$" },
    plan: { type: "string", example: "free | premium" },
  }),
  "/auth/verify-email": docFormatter(
    "post",
    "Auth",
    "Verify email",
    false,
    [],
    null,
    {
      token: { type: "string", example: "123456", required: true },
    }
  ),
  "/auth/resend-verification-email": docFormatter(
    "post",
    "Auth",
    "Resend email verification token",
    false,
    [],
    null,
    {
      email: {
        type: "string",
        example: "tonywhite@gmail.com",
      },
    }
  ),
  "/auth/request-reset-password": docFormatter(
    "post",
    "Auth",
    "Send token to reset user password",
    false,
    [],
    null,
    {
      email: {
        type: "string",
        example: "tonywhite@gmail.com",
      },
    }
  ),
  "/auth/reset-password": docFormatter(
    "post",
    "Auth",
    "Reset password",
    false,
    [],
    null,
    {
      token: {
        type: "string",
        example: "123456",
      },
      password: {
        type: "string",
        example: "User1234$",
      },
    }
  ),
  "/auth/login": docFormatter("post", "Auth", "Login Users.", false, [], null, {
    email: {
      type: "string",
      example: "tonywhite@gmail.com",
    },
    password: {
      type: "string",
      example: "User1234$",
    },
  }),
};
