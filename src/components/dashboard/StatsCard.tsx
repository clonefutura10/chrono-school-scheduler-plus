
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description?: string;
  trending?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trending,
  trendValue,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-school-50 flex items-center justify-center text-school-500">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trending && (
          <div
            className={`flex items-center mt-1 ${
              trending === "up"
                ? "text-green-600"
                : trending === "down"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {trending === "up" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.966.341l-4.285-2.475a.75.75 0 01.75-1.3l2.322 1.342a19.422 19.422 0 00-3.228-6.275L7 10.145 1.72 4.867a.75.75 0 010-1.06.75.75 0 011.06 0l-.56.354z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
