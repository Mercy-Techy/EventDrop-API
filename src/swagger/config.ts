import { authDocs } from "../features/auth/doc";
import { eventDocs } from "../features/event/doc";
import { userDocs } from "../features/user/doc";

export const paths = {
  ...authDocs,
  ...eventDocs,
  ...userDocs,
};
