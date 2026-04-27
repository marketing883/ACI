'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIGenerateButtonProps {
  onGenerate: () => Promise<void>;
  disabled?: boolean;
  tooltip?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function AIGenerateButton({
  onGenerate,
  disabled = false,
  tooltip = 'Generate with AI',
  size = 'md',
  className = '',
}: AIGenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClick = async () => {
    if (isGenerating || disabled) return;
    setIsGenerating(true);
    try {
      await onGenerate();
    } finally {
      setIsGenerating(false);
    }
  };

  const sizeClasses = size === 'sm'
    ? 'w-7 h-7'
    : 'w-8 h-8';

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={handleClick}
        disabled={isGenerating || disabled}
        className={`
          ${sizeClasses}
          flex items-center justify-center
          rounded-lg
          bg-gradient-to-r from-violet-500 to-purple-600
          hover:from-violet-600 hover:to-purple-700
          disabled:from-gray-300 disabled:to-gray-400
          text-white
          shadow-sm hover:shadow-md
          transition-all duration-200
          disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isGenerating ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : (
          <Sparkles className={iconSize} />
        )}
      </button>

      {/* Tooltip */}
      <div className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-2 py-1
        bg-gray-900 text-white text-xs
        rounded-md whitespace-nowrap
        opacity-0 group-hover:opacity-100
        pointer-events-none
        transition-opacity duration-200
        z-10
      ">
        {isGenerating ? 'Generating...' : tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
