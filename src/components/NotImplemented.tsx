
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotImplementedProps {
  title: string;
}

export function NotImplemented({ title }: NotImplementedProps) {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          This page is currently under development and will be available soon.
        </p>
        <Button onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} />
          Go Back
        </Button>
      </div>
    </AppLayout>
  );
}
