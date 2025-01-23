import React from 'react';
import { cn } from "@/lib/utils";
import {
  User,
  Settings,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  disabled?: boolean;
}

const NavItem = ({ icon, label, href, disabled = false }: NavItemProps) => {
  const content = (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 px-2",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-100"
      )}
      disabled={disabled}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );

  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{content}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Not implemented</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return href ? (
    <a href={href} className="block no-underline">
      {content}
    </a>
  ) : (
    content
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 p-4 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">User Manager</h1>
      </div>

      <div className="space-y-2">
        <NavItem
          icon={<User className="h-4 w-4" />}
          label="User Management"
          href="/users"
        />
        <NavItem
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          href="/settings"
        />
      </div>

      <Separator className="my-4" />

      {/* Disabled Navigation */}
      <div className="space-y-2">
        <NavItem
          icon={<UserPlus className="h-4 w-4" />}
          label="Add Users"
          disabled
        />
        <NavItem
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Permissions"
          disabled
        />
      </div>
    </div>
  );
};

export default Sidebar;
