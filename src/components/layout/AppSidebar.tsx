
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
  CalendarCheck, 
  Bookmark, 
  Settings, 
  BookOpen,
  GraduationCap,
  Users,
  Clock
} from 'lucide-react';

const navItems = [
  { 
    label: 'Student Dashboard',
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
    label: 'Teacher Dashboard',
    href: '/teacher', 
    icon: <User className="h-5 w-5" />,
    roles: ['teacher', 'admin'] 
  },
  { 
    label: 'Classes',
    href: '/classes', 
    icon: <GraduationCap className="h-5 w-5" />,
    roles: ['teacher', 'admin'] 
  },
  { 
    label: 'Admin Dashboard',
    href: '/admin', 
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin'] 
  },
  { 
    label: 'Teacher Management',
    href: '/teachers', 
    icon: <User className="h-5 w-5" />,
    roles: ['admin'] 
  },
  { 
    label: 'Student Management',
    href: '/students', 
    icon: <Users className="h-5 w-5" />,
    roles: ['admin'] 
  },
  { 
    label: 'Attendance',
    href: '/attendance', 
    icon: <CalendarCheck className="h-5 w-5" />,
    roles: ['admin', 'teacher'] 
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
                  <SidebarMenuButton asChild isActive={location.pathname === item.href}>
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
