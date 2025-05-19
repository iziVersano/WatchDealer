import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Sun, Moon, Menu, User } from 'lucide-react';
import { logout, selectUser } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';

export default function Header() {
  const { setTheme, theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
            
            <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-primary dark:text-white">
                Watch Dealer Portal
              </h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode} 
              className="mr-2"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-neutral-200 dark:bg-neutral-600">
                      {user ? getInitials(user.username) : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                {user && (
                  <div className="px-2 py-1.5 text-sm">
                    Signed in as <span className="font-medium">{user.username}</span>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Your Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={handleLogout}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
