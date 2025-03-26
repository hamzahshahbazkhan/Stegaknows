"use client";

import { useRef, useState, useEffect } from "react";
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

export default function DecodeCard() {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [decodedText, setDecodedText] = useState("");

  // Load and display the image in the canvas
  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const image = new Image();
      image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
      };
      image.src = imageUrl;
    }
  }, [imageUrl]);

  // Handle file upload
  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setImageUrl(imageUrl);
    }
  };

  // Extract hidden text from image
  const getImageData = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let decodedBuffer = "";
    let last8Bits = "11111111";
    let j = 0;

    // Decode hidden message bit-by-bit
    while (last8Bits !== "00000000" && j < data.length) {
      let bit = (data[j] & 1).toString(); // Extract LSB from pixel
      decodedBuffer += bit;
      last8Bits = last8Bits.slice(1) + bit; // Shift and add new bit
      j++;
    }

    // Remove trailing "00000000"
    decodedBuffer = decodedBuffer.replace(/00000000$/, "");

    // Convert binary to text
    let chars = decodedBuffer.match(/.{8}/g) || [];
    const message = chars
      .map((byte) => String.fromCharCode(parseInt(byte, 2)))
      .join("");

    setDecodedText(message);
    console.log("Decoded Message:", message);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decode</CardTitle>
        <CardDescription>
          Upload an image to extract hidden text.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="imageUpload">Image</Label>
          <Input
            type="file"
            accept="image/*"
            id="imageUpload"
            placeholder="Upload the Image"
            onChange={handleImageUpload}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="decodedText">Decoded Text</Label>
          <Textarea id="decodedText" value={decodedText} readOnly />
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="noShadow"
          className="w-full bg-bw text-text"
          onClick={getImageData}
        >
          Decode
        </Button>
      </CardFooter>

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </Card>
  );
}
