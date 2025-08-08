import React from 'react';
import { clsx } from 'clsx';

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  iconClassName?: string;
}

export const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon: Icon,
  iconClassName = 'w-5 h-5',
  className,
  ...props
}) => {
  return (
    <div className="relative">
      <Icon className={clsx(
        'absolute left-4 top-1/2 -translate-y-1/2 text-brand-button-text/70',
        iconClassName
      )} />
      <input
        className={clsx(
          'w-full bg-brand-rose/60 text-brand-button-text placeholder:text-brand-button-text/80 border-none rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-rose transition-all duration-200',
          className
        )}
        {...props}
      />
    </div>
  );
};