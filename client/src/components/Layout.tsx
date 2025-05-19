import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, selectIsAuthenticated, selectIsAdmin } from '../store/authSlice';
import { AppDispatch } from '../store/store';
import Header from './Header';
import Navigation from './Navigation';
import { ThemeProvider } from '@/components/ui/theme-provider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [location, setLocation] = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isAuthenticated && location !== '/login') {
      setLocation('/login');
    }
  }, [isAuthenticated, location, setLocation]);

  // Only show navigation when authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="watch-dealer-theme">
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
          {children}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="watch-dealer-theme">
      <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Navigation />
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
