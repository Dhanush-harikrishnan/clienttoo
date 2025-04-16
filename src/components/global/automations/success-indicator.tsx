import React, { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuccessIndicatorProps {
  showSuccess: boolean;
  className?: string;
}

const SuccessIndicator = ({ showSuccess, className }: SuccessIndicatorProps) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (showSuccess) {
      setVisible(true);
      
      // After some time, fade out the indicator
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
  
  if (!showSuccess && !visible) return null;
  
  return (
    <div 
      className={cn(
        'fixed z-50 top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <CheckCircle size={20} className="animate-pulse" />
      <span className="font-medium">Success!</span>
    </div>
  )
}

export default SuccessIndicator 