
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ClassInfo {
  subject: string;
  teacher: string;
  room: string;
}

interface TimetableCellProps {
  classInfo?: ClassInfo;
  isBreak?: boolean;
  breakName?: string;
}

export function TimetableCell({ classInfo, isBreak, breakName }: TimetableCellProps) {
  if (isBreak) {
    return (
      <div className={cn('timetable-cell timetable-cell-break flex flex-col items-center justify-center')}>
        <div className="font-medium text-gray-700">{breakName}</div>
      </div>
    );
  }

  if (!classInfo) {
    return <div className="timetable-cell"></div>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('timetable-cell timetable-cell-active')}>
            <div className="class-subject">{classInfo.subject}</div>
            <div className="class-room">{classInfo.room}</div>
            <div className="class-teacher mt-2">{classInfo.teacher}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <div className="font-bold">{classInfo.subject}</div>
            <div>{classInfo.teacher}</div>
            <div>{classInfo.room}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
