import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { useDispatch } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { queryClient } from "./lib/queryClient";
import { store } from "./store/store";
import { getCurrentUser } from "./store/authSlice";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import InventoryPage from "./pages/InventoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminInventoryPage from "./pages/AdminInventoryPage";
import UserManagementPage from "./pages/UserManagementPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser() as any);
  }, [dispatch]);

  return (
    <Layout>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={InventoryPage} />
        <Route path="/favorites" component={FavoritesPage} />
        <Route path="/admin/inventory" component={AdminInventoryPage} />
        <Route path="/admin/users" component={UserManagementPage} />
        <Route path="/admin/analytics" component={AdminAnalyticsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
