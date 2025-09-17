// components/Loading.tsx
"use client";

import { useEffect, useState } from "react";

type LoadingSize = "small" | "medium" | "large";
type LoadingType = "spinner" | "dots" | "progress" | "skeleton";

interface LoadingProps {
  size?: LoadingSize;
  type?: LoadingType;
  fullScreen?: boolean;
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const Loading = ({
  size = "medium",
  type = "spinner",
  fullScreen = false,
  text = "",
  primaryColor = "#065f46",
  secondaryColor = "#f59e0b",
}: LoadingProps) => {
  const [progress, setProgress] = useState<number>(0);

  // Effect untuk progress bar (jika tipe progress)
  useEffect(() => {
    if (type === "progress") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [type]);

  const sizeClasses: Record<LoadingSize, string> = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const renderSpinner = () => (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} rounded-full border-4 opacity-20`}
        style={{ borderColor: primaryColor }}
      ></div>
      <div
        className={`${sizeClasses[size]} absolute top-0 left-0 rounded-full border-4 border-transparent animate-spin`}
        style={{
          borderTopColor: primaryColor,
          borderRightColor: secondaryColor,
        }}
      ></div>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${
            size === "small"
              ? "w-2 h-2"
              : size === "medium"
              ? "w-3 h-3"
              : "w-4 h-4"
          } rounded-full animate-bounce`}
          style={{
            backgroundColor: primaryColor,
            animationDelay: `${i * 0.1}s`,
          }}
        ></div>
      ))}
    </div>
  );

  const renderProgress = () => (
    <div className="w-48">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: primaryColor,
          }}
        ></div>
      </div>
      <p className="text-sm mt-2 text-center text-gray-600">
        {progress.toFixed(0)}%
      </p>
    </div>
  );

  const renderSkeleton = () => (
    <div className="flex space-x-4 animate-pulse">
      <div
        className="rounded-full"
        style={{
          width:
            size === "small" ? "2rem" : size === "medium" ? "3rem" : "4rem",
          height:
            size === "small" ? "2rem" : size === "medium" ? "3rem" : "4rem",
          backgroundColor: secondaryColor,
        }}
      ></div>
      <div className="flex-1 space-y-3 py-1">
        <div
          className="h-3 rounded"
          style={{ backgroundColor: secondaryColor, width: "80%" }}
        ></div>
        <div
          className="h-3 rounded"
          style={{ backgroundColor: secondaryColor, width: "60%" }}
        ></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case "dots":
        return renderDots();
      case "progress":
        return renderProgress();
      case "skeleton":
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        {renderContent()}
        {text && (
          <p
            className="mt-4 text-gray-700 font-medium"
            style={{ color: primaryColor }}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {renderContent()}
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default Loading;
