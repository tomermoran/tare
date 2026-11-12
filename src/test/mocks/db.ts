import type { Db } from "@/db/client";
import { testContext } from "./context";

// Stands in for @/db/client: forwards every call to the current test database.
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    if (!testContext.db) throw new Error("testContext.db isn't set");
    const value = Reflect.get(testContext.db, prop);
    return typeof value === "function" ? value.bind(testContext.db) : value;
  },
});
