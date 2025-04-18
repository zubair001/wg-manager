import { lazy } from "react";

export const AppLayout = lazy(() => import("../components/layout/AppLayout"));
export const Dashboard = lazy(() => import("./Dashboard"));
export const ArchivedLists = lazy(() => import("./ArchivedLists"));
export const Login = lazy(() => import("./Login"));
export const Signup = lazy(() => import("./Signup"));
export const SharedList = lazy(() => import("./SharedList"));
export const Templates = lazy(() => import("./Templates"));
export const NotFoundPage = lazy(() => import("./Errors/NotFoundPage"));
export const ErrorBoundary = lazy(() => import("./Errors/ErrorBoundary"));
