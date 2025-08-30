import { Actor, ClientType, UserType } from "../types";

export function determineActor(user: UserType | null | undefined, client: ClientType | null | undefined): Actor | undefined {
  if (user && user.id) {
    return {
      type: "employee",
      id: user.id,
    };
  } else if (client && client.id) {
    return {
      type: "client",
      id: client.id,
    };
  }
}
