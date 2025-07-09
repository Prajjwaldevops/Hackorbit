import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://neondb_owner:npg_rxeEtF1kB8cU@ep-nameless-water-ae0lgot3-pooler.c-2.us-east-2.aws.neon.tech/beat_cancer?sslmode=require&channel_binding=require"
);
export const db = drizzle(sql, { schema });

