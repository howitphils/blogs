import { Collection, MongoClient } from "mongodb";
import { BlogDbModel } from "../blogs/types/blogs-types";

export let blogsCollection: Collection<BlogDbModel>;

export const runDb = async (url: string, dbName: string) => {
  const client = new MongoClient(url);
  const db = client.db(dbName);

  blogsCollection = db.collection("blogsCollection");

  try {
    await client.connect();
    console.log("Sucessfully connected to db");
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }

  return client;
};
