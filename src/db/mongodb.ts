import { ServerError } from "../core/middlewares/error-handling/custom-errors/server-error";
import mongoose from "mongoose";

export const runDb = async (url: string) => {
  try {
    await mongoose.connect(url);
  } catch (e) {
    await mongoose.disconnect();
    throw new ServerError(`❌ Database not connected: ${e}`);
  }
};

export const clearCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);

  for (const coll of collections) {
    await mongoose.connection.collection(coll).deleteMany({});
  }
};

// export const clearCollections = async () => {
//   const collections = await db.listCollections().toArray();

//   for (const coll of collections) {
//     await db.collection(coll.name).deleteMany({});
//   }
// };
