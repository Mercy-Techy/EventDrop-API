import docFormatter from "../../swagger/docFormatter";

export const userDocs = {
  "/user/fetch-user": docFormatter("get", "User", "Fetch user details"),
  "/user/upload-profile-picture": docFormatter(
    "post",
    "User",
    "Upload profile picture",
    true,
    [],
    null,
    {
      avatar: { type: "string", format: "binary" },
    },
    {},
    "multipart/form-data"
  ),
  "/user/update-profile": docFormatter(
    "put",
    "User",
    "Update profile",
    true,
    [],
    null,
    {
      firstname: { type: "string", example: "Tony" },
      lastname: { type: "string", example: "White" },
      email: { type: "string", example: "tonywhite@gmail.com" },
    }
  ),
};
