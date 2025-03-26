"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState, useEffect } from "react";

export default function EncodeCard() {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const image = new Image();
      image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.height = image.height;
        canvas.width = image.width;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
      };
      image.src = imageUrl;
    }
  }, [imageUrl]);

  const handleImageUpload = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setImageUrl(imageUrl);
    }
  };

  const getImageData = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let message = text || "test message"; // Use input text if available
    const binary =
      message
        .split("")
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
        .join("") + "00000000";

    let i = 0;
    const newData = [...data];

    for (let j = 0; j < newData.length; j++) {
      if (i < binary.length) {
        newData[j] = (newData[j] & 254) | parseInt(binary[i]);
        i++;
      }
    }

    const newImageData = new ImageData(
      new Uint8ClampedArray(newData),
      canvas.width,
      canvas.height,
    );
    ctx.putImageData(newImageData, 0, 0);

    // Create and trigger download link
    const imageURL = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = imageURL;
    downloadLink.download = "stegoImg.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encode</CardTitle>
        <CardDescription>
          Enter the Host Image and the Parasite Image or the Parasite text
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="host">Host Image</Label>
          <Input
            type="file"
            accept="image/*"
            id="host"
            placeholder="Upload the Host Image"
            onChange={handleImageUpload}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="parasiteText">Parasite Text</Label>
          <Textarea
            id="parasiteText"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="noShadow"
          className="w-full bg-bw text-text"
          onClick={getImageData}
        >
          Encode
        </Button>
      </CardFooter>

      <canvas ref={canvasRef}></canvas>
    </Card>
  );
}
