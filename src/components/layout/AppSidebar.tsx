
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Calendar, User } from 'lucide-react';

const navItems = [
  { 
    label: 'Dashboard',
    href: '/', 
    icon: <Calendar className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'student'] 
  },
  { 
    label: 'Teacher Dashboard',
    href: '/teacher', 
    icon: <User className="h-5 w-5" />,
    roles: ['teacher', 'admin'] 
  },
  { 
    label: 'Admin Dashboard',
    href: '/admin', 
    icon: <Calendar className="h-5 w-5" />,
    roles: ['admin'] 
  },
];

export function AppSidebar() {
  const location = useLocation();
  // For this demo, we'll default the userRole to "admin" so all navigation is visible
  const userRole = "admin";

  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-school-500 flex items-center justify-center">
            <span className="text-white font-bold">ST</span>
          </div>
          <div>
            <p className="font-poppins font-semibold text-school-900">School Timetable</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild active={location.pathname === item.href}>
                    <Link to={item.href} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-gray-500">
          v1.0.0 &copy; 2025 CloneFutura
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
