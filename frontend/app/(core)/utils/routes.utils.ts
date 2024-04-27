export enum ApplicationRoutes {
  Root = '/',
  Any = '*',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  AccountCompletion = '/account-completion',
  Home = '/home',
  Dashboard = '/dashboard',
  Profile = '/profile',
  Users = '/users',
  UserDetails = '/users/:id',
  UserCreate = '/users/create',
  UserEdit = '/users/:id/edit',
  Posts = '/posts',
  PostDetails = '/posts/:id',
  PostCreate = '/posts/create',
  PostEdit = '/posts/:id/edit',
  Chats = '/chats',
  ChatDetails = '/chats/:id',
}

export const ProtectedRoutes: ApplicationRoutes[] = [
  ApplicationRoutes.Home,
  ApplicationRoutes.Dashboard,
  ApplicationRoutes.Profile,
  ApplicationRoutes.Users,
  ApplicationRoutes.UserDetails,
  ApplicationRoutes.UserCreate,
  ApplicationRoutes.UserEdit,
  ApplicationRoutes.Posts,
  ApplicationRoutes.PostDetails,
  ApplicationRoutes.PostCreate,
  ApplicationRoutes.PostEdit,
  ApplicationRoutes.Chats,
  ApplicationRoutes.ChatDetails,
];

export const RouteMatcher: { [key: string]: RegExp } = {
  [ApplicationRoutes.Home]: /\/home/i,
  [ApplicationRoutes.Users]: /\/users(\/(\d|(a-z)){36, 36})?/i,
  [ApplicationRoutes.Chats]: /\/chats(\/(\d|(a-z)){36, 36})?/i,
  [ApplicationRoutes.Profile]: /\/profile/i,
};
