import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <div className="mx-auto w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
