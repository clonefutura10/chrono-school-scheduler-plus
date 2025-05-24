
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
import { 
  Home, 
  User, 
  Bookmark, 
  Settings, 
  BookOpen,
  GraduationCap,
  Clock
} from 'lucide-react';

const navItems = [
  { 
    label: 'Student',
    href: '/', 
    icon: <Home className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'student'] 
  },
  { 
    label: 'My Schedule',
    href: '/schedule', 
    icon: <Clock className="h-5 w-5" />,
    roles: ['student'] 
  },
  { 
    label: 'Assignments',
    href: '/assignments', 
    icon: <BookOpen className="h-5 w-5" />,
    roles: ['student', 'teacher'] 
  },
  { 
    label: 'Teacher',
    href: '/teacher', 
    icon: <User className="h-5 w-5" />,
    roles: ['teacher', 'admin'] 
  },
  { 
    label: 'Admin',
    href: '/admin', 
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin'] 
  },
  { 
    label: 'Reports',
    href: '/reports', 
    icon: <Bookmark className="h-5 w-5" />,
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
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="text-white h-5 w-5" />
          </div>
          <div>
            <p className="font-poppins font-bold text-lg text-gray-900">School Portal</p>
            <p className="text-xs text-gray-500">Academic Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-gray-600">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                    <Link to={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-sm">
                      <div className={`p-1.5 rounded-md ${location.pathname === item.href ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </div>
                      <span className={`font-medium ${location.pathname === item.href ? 'text-blue-600' : 'text-gray-700'}`}>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="text-xs text-gray-400 text-center">
            v2.0.0 &copy; 2025 School Management
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
