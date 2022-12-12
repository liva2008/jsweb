import {
  Bson,
  MongoClient,
  GridFSBucket, 
  ObjectId
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export { GridFSBucket, ObjectId };

const client = new MongoClient();

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
await client.connect("mongodb://127.0.0.1:27017");

export const db = client.database("jsweb");