import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "./pages";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
          <Toaster />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};
export default App;
