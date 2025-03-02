export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}
export interface IBlog {
  id: string;
  title: string;
  content: string;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogList {
  totalCount: { count: number };
  blogs: IBlog;
}
