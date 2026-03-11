import { Collection, Db, MongoClient } from "mongodb";
import { BlogDbModel } from "../blogs/types/blogs-types";
import { PostDbModel } from "../posts/types/posts-types";
import { CommentDbModel } from "../comments/types/comments-types";
import { SessionDbModel } from "../users/types/sessions-types";
import { ServerError } from "../core/middlewares/error-handling/custom-errors/server-error";
import { User } from "../users/application/classes/user";

export let db: Db; // Export for tests (TESTING API). It will contain db name, that was up and running after runDb function

export let blogsCollection: Collection<BlogDbModel>;
export let postsCollection: Collection<PostDbModel>;
export let usersCollection: Collection<User>;
export let commentsCollection: Collection<CommentDbModel>;
export let sessionsCollection: Collection<SessionDbModel>;

export const runDb = async (url: string, dbName: string) => {
  const mongoClient = new MongoClient(url);
  db = mongoClient.db(dbName);

  blogsCollection = db.collection("blogsCollection");
  postsCollection = db.collection("postsCollection");
  usersCollection = db.collection("usersCollection");
  commentsCollection = db.collection("commentsCollection");
  sessionsCollection = db.collection("sessionsCollection");

  try {
    await mongoClient.connect();
  } catch (e) {
    await mongoClient.close();
    throw new ServerError(`❌ Database not connected: ${e}`);
  }

  return mongoClient;
};

export const clearCollections = async () => {
  const collections = await db.listCollections().toArray();

  for (const coll of collections) {
    await db.collection(coll.name).deleteMany({});
  }
};
