import React from 'react';
import { cn } from '@/lib/utils';

interface CalendarProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  initialFocus?: boolean;
  className?: string;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ mode = 'single', selected, onSelect, className }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    
    const today = new Date();
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    const days = [];
    const date = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    const isSelected = (day: Date) => {
      return selected && day.toDateString() === selected.toDateString();
    };
    
    const isToday = (day: Date) => {
      return day.toDateString() === today.toDateString();
    };
    
    const isCurrentMonth = (day: Date) => {
      return day.getMonth() === currentMonth.getMonth();
    };
    
    return (
      <div ref={ref} className={cn("p-3", className)}>
        <div className="grid grid-cols-7 gap-1">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => onSelect?.(day)}
              className={cn(
                "h-8 w-8 text-sm rounded-md transition-colors",
                isCurrentMonth(day) ? "text-gray-900" : "text-gray-400",
                isSelected(day) && "bg-blue-600 text-white",
                isToday(day) && !isSelected(day) && "bg-gray-100",
                "hover:bg-gray-100"
              )}
            >
              {day.getDate()}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar"; 