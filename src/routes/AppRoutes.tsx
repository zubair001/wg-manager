import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingSpinner, ListDetail } from "@/components";
import { Dashboard, Login, SharedList, Signup } from "@/pages";
import PrivateRoutes from "./PrivateRoutes";
import { NotFoundPage, ArchivedLists, Templates } from "@/pages";

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/share/:token" element={<SharedList />} />
        {/* Protected App Routes */}
        <Route path="/" element={<PrivateRoutes />}>
          <Route index element={<Dashboard />} />
          <Route
            path="list/:id"
            element={<ListDetail isTemplateView={false} />}
          />
          <Route path="/archived" element={<ArchivedLists />} />
          <Route path="/templates" element={<Templates />} />
          <Route
            path="/template/:id"
            element={<ListDetail isTemplateView={true} />}
          />
        </Route>
        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
