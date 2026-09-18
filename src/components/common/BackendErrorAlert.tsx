import React from 'react';

import { AlertTriangle } from 'lucide-react';

interface BackendErrorAlertProps {
  error?: string | null;
  className?: string;
}

export const BackendErrorAlert: React.FC<BackendErrorAlertProps> = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-[12px] border border-[#FDA29B] bg-[#FEF3F2] p-3.5 sm:p-4 text-[#B42318] shadow-xs ${className}`}
    >
      <AlertTriangle className="h-5 w-5 shrink-0 text-[#D92D20] mt-0.5" />
      <div className="flex-1 text-[13px] sm:text-[14px] font-normal leading-[20px] text-[#B42318]">
        {error}
      </div>
    </div>
  );
};

export default BackendErrorAlert;
