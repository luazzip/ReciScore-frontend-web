import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ isLoading = false, variant = 'primary', disabled, children, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled || isLoading} {...rest}>
      {isLoading ? 'Procesando...' : children}
    </button>
  );
}
