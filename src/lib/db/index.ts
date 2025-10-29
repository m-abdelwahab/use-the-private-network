import { SQL } from "bun";

export const dbPrivate = new SQL(process.env.DATABASE_URL);
export const dbPublic = new SQL(process.env.DATABASE_PUBLIC_URL);
