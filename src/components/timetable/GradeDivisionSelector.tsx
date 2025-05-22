
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface GradeDivisionSelectorProps {
  selectedGrade: string;
  selectedDivision: string;
  onGradeChange: (grade: string) => void;
  onDivisionChange: (division: string) => void;
}

export function GradeDivisionSelector({
  selectedGrade,
  selectedDivision,
  onGradeChange,
  onDivisionChange,
}: GradeDivisionSelectorProps) {
  // Generate arrays for grades (1-10) and divisions (A-D)
  const grades = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  const divisions = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-2">
        <Label htmlFor="grade-select">Grade</Label>
        <Select value={selectedGrade} onValueChange={onGradeChange}>
          <SelectTrigger id="grade-select" className="w-[180px]">
            <SelectValue placeholder="Select Grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                Grade {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="division-select">Division</Label>
        <Select value={selectedDivision} onValueChange={onDivisionChange}>
          <SelectTrigger id="division-select" className="w-[180px]">
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((division) => (
              <SelectItem key={division} value={division}>
                Division {division}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
