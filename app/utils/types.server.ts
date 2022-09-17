export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
}

export interface CreateOrEditPost {
  id?: string;
  title: string;
  body: string;
  postImg: string;
  categories: Array<{
    name: string;
  }>;

  userId: string;
}

export interface UpdatePost {
  id: string;
  title: string;
  body: string;
  postImg: string;
  categories: Array<{
    name: string;
  }>;
  userId: string;
}

export interface CategoryForm {
  name: string;
}

export interface UpdateCategoryForm {
  id: string;
  name: string;
}
