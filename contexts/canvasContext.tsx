"use client";

import React, { createContext, useRef, useState, ReactNode } from "react";

interface CanvasContextType {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageURL: string;
  loadImageToCanvas: (url: string) => void;
  downloadButton: boolean;
  setDownloadButton: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CanvasContext = createContext<CanvasContextType>(null!);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageURL, setImageURL] = useState<string>("");
  const [downloadButton, setDownloadButton] = useState<boolean>(false);

  const loadImageToCanvas = (url: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setImageURL(url);
    };
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        imageURL,
        loadImageToCanvas,
        downloadButton,
        setDownloadButton,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
