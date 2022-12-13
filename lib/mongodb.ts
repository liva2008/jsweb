import {
  Bson,
  MongoClient,
  GridFSBucket, 
  ObjectId
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { createPool } from "https://deno.land/x/generic_pool/mod.ts";

export { GridFSBucket, ObjectId };

/*
1.Connecting to a Local Database:
await client.connect("mongodb://127.0.0.1:27017/");
await client.connect("mongodb://localhost:27017/");

2.Connecting to a Mongo Atlas Database
await client.connect({
  db: "<db_name>",
  tls: true,
  servers: [
    {
      host: "<db_cluster_url>",
      port: 27017,
    },
  ],
  credential: {
    username: "<username>",
    password: "<password>",
    db: "<db_name>",
    mechanism: "SCRAM-SHA-1",
  },
});

3.Connect using srv url
await client.connect(
  "mongodb+srv://<username>:<password>@<db_cluster_url>/<db_name>?authMechanism=SCRAM-SHA-1",
);
*/

//await client.connect("mongodb://test:123456@127.0.0.1:27017/test");

/**
 * Step 1 - Create pool using a factory object
 */
 const factory = {
  async create() {
    const client = new MongoClient();
    try {
      await client.connect("mongodb://127.0.0.1:27017");
    } catch (err) {
      console.error(err);
    }
    return client;
  },
  async destroy(client) {
    await client.close();
  },
};

const opts = {
  max: 10, // maximum size of the pool
  min: 2 // minimum size of the pool
};

const pool = createPool(factory, opts);

/**
 * Step 2 - Use pool in your code to acquire/release resources
 */

// acquire connection - Promise is resolved
// once a resource becomes available
const client = await pool.acquire();
//console.log(pool);

export const db = client.database("jsweb");