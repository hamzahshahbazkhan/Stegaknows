"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext } from "react";
import { CanvasContext } from "@/contexts/canvasContext";

export default function SideTab() {
  const { canvasRef, downloadButton, imageURL } = useContext(CanvasContext);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const imageURL = canvasRef.current.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = imageURL;
    downloadLink.download = "stegoImg.png";
    downloadLink.click();
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-4 w-full overflow-hidden">
      <Card className="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardHeader className="shrink-0">
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 flex-1 min-h-0 overflow-auto">
          {!imageURL && <div>Upload an image to see preview</div>}
          <canvas
            ref={canvasRef}
            className="block max-w-full h-auto object-contain"
          />
        </CardContent>
      </Card>

      {downloadButton && (
        <Button onClick={handleDownload} className="w-full">
          Download
        </Button>
      )}
    </div>
  );
}
