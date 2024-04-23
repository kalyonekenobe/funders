export enum ApplicationRoutes {
  Root = '/',
  Any = '*',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  AccountCompletion = '/account-completion',
  AuthError = '/auth/error',
  Home = '/home',
  Dashboard = '/dashboard',
  Profile = '/profile',
  UserDetails = '/users/:id',
  PostDetails = '/posts/:id',
}

export const ProtectedRoutes: ApplicationRoutes[] = [ApplicationRoutes.Root];
