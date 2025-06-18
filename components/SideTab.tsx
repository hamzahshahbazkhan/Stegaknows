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
    <div className="flex flex-col h-full gap-4 w-full">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!imageURL && <div>Upload an image to see preview</div>}
          <canvas ref={canvasRef} />
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
