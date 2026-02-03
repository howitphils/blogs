import { Collection, Db, MongoClient } from "mongodb";
import { BlogDbModel } from "../blogs/types/blogs-types";
import { PostDbModel } from "../posts/types/posts-types";
import { UserDbModel } from "../users/types/users-types";

export let db: Db; // Export for tests (TESTING API). It will contain db name, that was up and running after runDb function

export let blogsCollection: Collection<BlogDbModel>;
export let postsCollection: Collection<PostDbModel>;
export let usersCollection: Collection<UserDbModel>;

export const runDb = async (url: string, dbName: string) => {
  const mongoClient = new MongoClient(url);
  db = mongoClient.db(dbName);

  blogsCollection = db.collection("blogsCollection");
  postsCollection = db.collection("postsCollection");
  usersCollection = db.collection("usersCollection");

  try {
    await mongoClient.connect();
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
