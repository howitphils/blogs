import "reflect-metadata";
import { Container } from "inversify";
import { UsersRepository } from "./users/repository/users-repository";
import { SessionsRepository } from "./users/repository/sessions-repository";
import { UsersService } from "./users/application/users-service";
import { UsersQueryRepository } from "./users/repository/users-query-repository";
import { UsersController } from "./users/api/controller/users-controller";
import { SessionsController } from "./users/api/controller/sessions-controller";
import { AuthController } from "./users/api/controller/auth-controller";
import { PasswordService } from "./core/services/password-service";
import { DateService } from "./core/services/date-service";
import { EmailService } from "./core/services/email-service/email-service";
import { TokenService } from "./core/services/token-service";
import { CommentsService } from "./comments/application/comments-service";
import { CommentsController } from "./comments/api/controller/comments-controller";
import { CommentsRepository } from "./comments/repository/comments-repository";
import { BlogsController } from "./blogs/api/controller/blogs-controller";
import { BlogsService } from "./blogs/application/blogs-service";
import { BlogsRepository } from "./blogs/repository/blogs-repository";
import { BlogsQueryRepository } from "./blogs/repository/blogs-query-repository";
import { PostsRepository } from "./posts/repository/posts-repository";
import { PostsQueryRepository } from "./posts/repository/posts-query-repository";
import { PostsService } from "./posts/application/posts-service";
import { PostsController } from "./posts/api/controller/posts-controller";

export const container = new Container();

container.bind(PasswordService).to(PasswordService);
container.bind(EmailService).to(EmailService);
container.bind(TokenService).to(TokenService);
container.bind(DateService).to(DateService);

container.bind(UsersRepository).to(UsersRepository);
container.bind(SessionsRepository).to(SessionsRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);

container.bind(UsersService).to(UsersService);
container.bind(CommentsService).to(CommentsService);
container.bind(BlogsService).to(BlogsService);
container.bind(PostsService).to(PostsService);

container.bind(UsersController).to(UsersController);
container.bind(SessionsController).to(SessionsController);
container.bind(AuthController).to(AuthController);
container.bind(CommentsController).to(CommentsController);
container.bind(BlogsController).to(BlogsController);
container.bind(PostsController).to(PostsController);
