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
    "inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900",
    ghost:
      "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900",
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
