// Core component that receives mouse positions and renders pointer and content

import React, { useState } from "react";

import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { cn } from "../lib/utils";
 
export const FollowerPointerCard = ({
  children,
  className,
  title,
  icon,
  iconImage,
  iconColor = "#3b82f6",
  iconSize = 24,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
  iconImage?: string; // 圖片路徑，可以是 import 的路徑或相對路徑
  iconColor?: string;
  iconSize?: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [isInside, setIsInside] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    }
  };
  const handleMouseLeave = () => {
    setIsInside(false);
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };
  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      style={{
        cursor: "none",
      }}
      ref={ref}
      className={cn("relative", className)}
    >
      <AnimatePresence>
        {isInside && (
          <FollowPointer 
            x={x} 
            y={y} 
            title={title}
            icon={icon}
            iconImage={iconImage}
            iconColor={iconColor}
            iconSize={iconSize}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export const FollowPointer = ({
  x,
  y,
  title,
  icon,
  iconImage,
  iconColor = "#3b82f6",
  iconSize = 24,
}: {
  x: any;
  y: any;
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
  iconImage?: string; // 圖片路徑
  iconColor?: string;
  iconSize?: number;
}) => {
  const colors = [
    "#0ea5e9",
    "#737373",
    "#14b8a6",
    "#22c55e",
    "#3b82f6",
    "#ef4444",
    "#eab308",
  ];
  
  // 固定顏色，避免每次渲染都改變
  const [color] = useState(() => colors[Math.floor(Math.random() * colors.length)]);
  
  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      style={{
        x,
        y,
      }}
      initial={{
        scale: 0,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
      }}
    >
      {/* 優先使用圖片，然後是自訂 icon，最後是預設 SVG */}
      {iconImage ? (
        <img
          src={iconImage}
          alt="cursor"
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
          }}
          className="pointer-events-none"
        />
      ) : icon ? (
        <div 
          style={{ 
            color: iconColor,
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            transform: "translate(-50%, -50%)",
          }}
          className="flex items-center justify-center pointer-events-none"
        >
          {icon}
        </div>
      ) : (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="1"
          viewBox="0 0 16 16"
          className="transform pointer-events-none"
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            color: iconColor,
            transform: "translate(-50%, -50%) rotate(-70deg)",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
        </svg>
      )}
      
      {title && (
        <motion.div
          style={{
            backgroundColor: color,
          }}
          initial={{
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.5,
            opacity: 0,
          }}
          className="min-w-max rounded-full px-2 py-2 text-xs whitespace-nowrap text-white mt-2"
        >
          {title}
        </motion.div>
      )}
    </motion.div>
  );
};
