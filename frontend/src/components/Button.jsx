import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed border-2 border-transparent";

  const styles = {
    primary:
      "bg-primary-600 text-white hover:bg-transparent hover:border-primary-600 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-500 shadow-md shadow-primary-500/20 hover:shadow-none",
    danger:
      "bg-red-500 text-white hover:bg-transparent hover:border-red-500 hover:text-red-500 shadow-md hover:shadow-none",
    outline:
      "border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-500",
    ghost:
      "text-slate-700 dark:text-slate-200 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
