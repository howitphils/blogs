import { Collection, Db, MongoClient } from "mongodb";
import { BlogDbModel } from "../blogs/types/blogs-types";

export let db: Db; // Export for tests. It will contain db name, that was up and running after runDb function

export let blogsCollection: Collection<BlogDbModel>;

export const runDb = async (url: string, dbName: string) => {
  const mongoClient = new MongoClient(url);
  db = mongoClient.db(dbName);

  blogsCollection = db.collection("blogsCollection");

  try {
    await mongoClient.connect();
    console.log("Sucessfully connected to db");
  } catch (e) {
    await mongoClient.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }

  return mongoClient;
};

export const clearCollections = async () => {
  const collections = await db.listCollections().toArray();

  for (const coll of collections) {
    await db.collection(coll.name).deleteMany({});
  }
};
