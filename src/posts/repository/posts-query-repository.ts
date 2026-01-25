import { ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../db/mongodb";
import { PostDbModel, PostViewModel } from "../types/posts-types";

export const postsQueryRepository = {
  async getPosts(): Promise<PostViewModel[]> {
    const dbPosts = await postsCollection.find({}).toArray();

    return dbPosts.map(postsQueryRepository.mapFromDbToView);
  },

  async getPostById(id: string): Promise<PostViewModel | null> {
    const dbPost = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbPost) {
      return null;
    }

    return postsQueryRepository.mapFromDbToView(dbPost);
  },

  mapFromDbToView(post: WithId<PostDbModel>): PostViewModel {
    return {
      id: post._id.toString(),
      blogId: post.blogId,
      blogName: post.blogName,
      shortDescription: post.shortDescription,
      content: post.content,
      title: post.title,
    };
  },
};
