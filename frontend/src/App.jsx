import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import Frontpage from "./Frontpage.jsx";
import { UserProvider, useUser } from "./context/UserContext.jsx";
import LogonPage from "./pages/LogonPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LogonPage />} />
          <Route
            path="/frontpage"
            element={
              <RequireUser>
                <Frontpage />
              </RequireUser>
            }
          />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </UserProvider>
    </QueryClientProvider>
  );
}

function RequireUser({ children }) {
  const { user } = useUser();

  return user ? children : <Navigate to="/" replace />;
}
