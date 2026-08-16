"use client";

import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "outline" | "primary" | "white" | "ghost";
  isLight?: boolean;
  animatedHover?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  showDot?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  href,
  variant = "outline",
  isLight = false,
  animatedHover = false,
  children,
  icon,
  className = "",
  target,
  rel,
  showDot = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group select-none overflow-hidden";

  let variantStyles = "";

  if (variant === "outline") {
    variantStyles = isLight
      ? "border border-slate-900/25 bg-slate-900/5 text-slate-900 hover:bg-[#0c0c0e] hover:text-white hover:border-[#0c0c0e]"
      : "border border-white/25 bg-white/5 text-white hover:bg-white hover:text-[#0c0c0e] hover:border-white";
  } else if (variant === "primary") {
    variantStyles = "border border-transparent bg-[#0c0c0e] text-white hover:bg-white hover:text-[#0c0c0e] hover:border-[#0c0c0e]";
  } else if (variant === "white") {
    variantStyles =
      "bg-white text-slate-900 border border-slate-300 hover:bg-[#0c0c0e] hover:text-white hover:border-[#0c0c0e]";
  } else if (variant === "ghost") {
    variantStyles = isLight
      ? "text-slate-900 hover:bg-slate-900/10"
      : "text-white hover:bg-white/10";
  }

  const combinedClasses = `${baseStyles} ${variantStyles} ${className}`.trim();

  const innerContent = animatedHover ? (
    <>
      {/* Arrow (left side, vertically centered, slides in on hover) */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-lg font-normal leading-none opacity-0 -translate-x-4 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-x-0 select-none">
        →
      </span>

      {/* Button Text (slides right on hover to create clean gap with arrow) */}
      <span className="transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-5">
        {children}
      </span>

      {/* Dot on right side (scales down and disappears on hover) or custom icon */}
      {icon ? (
        <div className="ml-2.5 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-5">
          {icon}
        </div>
      ) : (
        <div className="ml-2.5 flex items-center justify-center w-1.5 h-1.5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-0 group-hover:scale-0 shrink-0" />
      )}
    </>
  ) : (
    <>
      <span>{children}</span>
      {icon ? (
        <span>{icon}</span>
      ) : showDot ? (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      ) : null}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={combinedClasses}
          onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {innerContent}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClasses} onClick={onClick} {...props}>
      {innerContent}
    </button>
  );
};

export default Button;
