import { authDocs } from "../features/auth/doc";
import { eventDocs } from "../features/event/doc";

export const paths = {
  ...authDocs,
  ...eventDocs,
};
