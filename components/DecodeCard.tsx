"use client";
import { useState, useContext, useRef } from "react";
import { CanvasContext } from "@/contexts/canvasContext";
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [decodedText, setDecodedText] = useState<string>("");
  const [decodedByteStream, setDecodedByteStream] = useState<number[]>([]);
  const [decodedImage, setDecodedImage] = useState<string | null>(null);
  const { setDownloadButton } = useContext(CanvasContext);
  const decodedImageCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setDownloadButton(false);
    setDecodedText("");
    setDecodedImage(null);
  };

  const decodeText = () => {
    if (!imageUrl) {
      alert("Please upload an image first");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let dataIndex = 0;

      const extractBits = (numBits: number): string => {
        let bits = "";
        while (bits.length < numBits && dataIndex < data.length) {
          const pixelValue = data[dataIndex];
          const bit = pixelValue & 1;
          bits += bit.toString();
          dataIndex++;
        }
        return bits;
      };

      const stegBits = extractBits(24);
      const expectedHeader = [..."STG"]
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join("");

      if (stegBits !== expectedHeader) {
        setDecodedText("No hidden data found");
        return;
      }

      const typeBits = extractBits(8);
      const dataType = parseInt(typeBits, 2);
      if (dataType === 3) {
        const widthBits = extractBits(16);
        const heightBits = extractBits(16);

        const width = parseInt(widthBits, 2);
        const height = parseInt(heightBits, 2);

        if (width <= 0 || height <= 0 || width > 1000 || height > 1000) {
          setDecodedText("Invalid image dimensions detected");
          return;
        }

        const totalPixels = width * height;
        const totalBytes = totalPixels * 4; // RGBA
        const imageBytes = [];
        let binaryString = "";

        while (imageBytes.length < totalBytes && dataIndex < data.length) {
          binaryString += (data[dataIndex] & 1).toString();
          dataIndex++;

          if (binaryString.length >= 8) {
            const byte = binaryString.substring(0, 8);
            binaryString = binaryString.substring(8);
            const number = parseInt(byte, 2);
            imageBytes.push(number);
          }
        }

        if (decodedImageCanvasRef.current && imageBytes.length >= totalBytes) {
          const decodedCanvas = decodedImageCanvasRef.current;
          decodedCanvas.width = width;
          decodedCanvas.height = height;
          const decodedCtx = decodedCanvas.getContext("2d");

          if (decodedCtx) {
            const newImageData = decodedCtx.createImageData(width, height);

            for (let i = 0; i < totalBytes && i < imageBytes.length; i++) {
              newImageData.data[i] = imageBytes[i];
            }

            decodedCtx.putImageData(newImageData, 0, 0);
            setDecodedImage(decodedCanvas.toDataURL());
            setDecodedText("Hidden image decoded successfully!");
          }
        } else {
          setDecodedText(`Failed to decode`);
        }
      } else if (dataType === 1) {
        let message = "";
        let binaryString = "";
        const byteStream = [];

        while (message.length < 10000 && dataIndex < data.length) {
          binaryString += (data[dataIndex] & 1).toString();
          dataIndex++;

          if (binaryString.length >= 8) {
            const byte = binaryString.substring(0, 8);
            binaryString = binaryString.substring(8);
            const charCode = parseInt(byte, 2);
            byteStream.push(charCode);

            if (charCode === 0) break;
            message += String.fromCharCode(charCode);
          }
        }

        setDecodedByteStream(byteStream);
        setDecodedText(message || "No text message found");
        setDecodedImage(null);
      } else {
        setDecodedText("Unknown data type or corrupted data");
        setDecodedImage(null);
      }
    };
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Decode</CardTitle>
        <CardDescription className="text-md">
          Extract hidden text or image from an image
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="encodedImage">Encoded Image</Label>
          <Input
            type="file"
            accept="image/*"
            id="encodedImage"
            onChange={handleImageUpload}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="decodedText">Decoded Message</Label>
          <Textarea
            id="decodedText"
            value={decodedText}
            readOnly
            placeholder="Hidden message will appear here"
            rows={5}
          />
        </div>

        {decodedImage && (
          <div className="space-y-1">
            <Label>Decoded Secret Image</Label>
            <div className="border rounded p-2">
              <img
                src={decodedImage}
                alt="Decoded secret image"
                className="max-w-full h-auto"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
        )}

        <canvas ref={decodedImageCanvasRef} style={{ display: "none" }} />
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={decodeText} disabled={!imageUrl}>
          Decode Message
        </Button>
      </CardFooter>
    </Card>
  );
}
