import React from 'react';
import { cn } from '@/lib/utils';

interface PopoverProps {
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface PopoverContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
}

const PopoverContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {}
});

export const Popover: React.FC<PopoverProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ 
  asChild = false, 
  children 
}) => {
  const { setIsOpen } = React.useContext(PopoverContext);

  const handleClick = () => {
    setIsOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: handleClick
    });
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
};

export const PopoverContent: React.FC<PopoverContentProps> = ({ 
  className, 
  align = 'center', 
  children 
}) => {
  const { isOpen, setIsOpen } = React.useContext(PopoverContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-2 rounded-md border border-gray-200 bg-white shadow-lg",
        align === 'start' && 'left-0',
        align === 'center' && 'left-1/2 transform -translate-x-1/2',
        align === 'end' && 'right-0',
        className
      )}
    >
      {children}
    </div>
  );
}; 