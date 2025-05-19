import { useState } from 'react';
import { useLocation } from 'wouter';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../store/authSlice';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet';
import { 
  Watch, 
  Star, 
  FileEdit, 
  Users, 
  BarChart2, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface NavItemProps {
  title: string;
  path: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function NavItem({ title, path, icon, onClick }: NavItemProps) {
  const [location, navigate] = useLocation();
  const isActive = location === path;

  const handleClick = () => {
    navigate(path);
    if (onClick) onClick();
  };

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start mb-1",
        isActive 
          ? "bg-neutral-100 dark:bg-neutral-700 text-primary dark:text-white" 
          : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      )}
      onClick={handleClick}
    >
      {icon}
      <span className="ml-2">{title}</span>
    </Button>
  );
}

export default function Navigation() {
  const isAdmin = useSelector(selectIsAdmin);
  const [isOpen, setIsOpen] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(true);

  const closeSheet = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64 p-4">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Navigation
              </h2>
              <div className="space-y-1">
                <NavItem 
                  title="Inventory" 
                  path="/" 
                  icon={<Watch className="h-5 w-5" />}
                  onClick={closeSheet}
                />
                <NavItem 
                  title="Favorites" 
                  path="/favorites" 
                  icon={<Star className="h-5 w-5" />}
                  onClick={closeSheet}
                />
              </div>
            </div>

            {isAdmin && (
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-2 px-4">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Admin
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setAdminExpanded(!adminExpanded)}
                  >
                    {adminExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {adminExpanded && (
                  <div className="space-y-1">
                    <NavItem 
                      title="Manage Inventory" 
                      path="/admin/inventory" 
                      icon={<FileEdit className="h-5 w-5" />}
                      onClick={closeSheet}
                    />
                    <NavItem 
                      title="Users" 
                      path="/admin/users" 
                      icon={<Users className="h-5 w-5" />}
                      onClick={closeSheet}
                    />
                    <NavItem 
                      title="Analytics" 
                      path="/admin/analytics" 
                      icon={<BarChart2 className="h-5 w-5" />}
                      onClick={closeSheet}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <aside className="fixed md:relative -translate-x-full md:translate-x-0 z-30 w-64 h-full transition-transform duration-300 ease-in-out transform bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto hidden md:block">
        <div className="p-4">
          <div className="mb-8 mt-4">
            <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2">Navigation</div>
            <nav>
              <NavItem 
                title="Inventory" 
                path="/" 
                icon={<Watch className="h-5 w-5" />}
              />
              <NavItem 
                title="Favorites" 
                path="/favorites" 
                icon={<Star className="h-5 w-5" />}
              />

              {isAdmin && (
                <>
                  <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2 mt-8">Admin</div>
                  <NavItem 
                    title="Manage Inventory" 
                    path="/admin/inventory" 
                    icon={<FileEdit className="h-5 w-5" />}
                  />
                  <NavItem 
                    title="Users" 
                    path="/admin/users" 
                    icon={<Users className="h-5 w-5" />}
                  />
                  <NavItem 
                    title="Analytics" 
                    path="/admin/analytics" 
                    icon={<BarChart2 className="h-5 w-5" />}
                  />
                </>
              )}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
