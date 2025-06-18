"use client";

import { useRef, useState, useContext } from "react";
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

type Mode = "Text" | "Image";

export default function EncodeCard() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [secretBinary, setSecretBinary] = useState<string>("");
  const { loadImageToCanvas, setDownloadButton, canvasRef } =
    useContext(CanvasContext);
  const [mode, setMode] = useState<Mode>("Text");
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    loadImageToCanvas(url);
  };

  const toggleMode = () => {
    const newMode = mode === "Text" ? "Image" : "Text";
    setMode(newMode);
    setText("");
    setSecretBinary("");
  };

  const calculateOptimalSecretImageSize = (
    hostImageData: ImageData,
    secretImageWidth: number,
    secretImageHeight: number,
  ) => {
    const hostCapacity = hostImageData.data.length;
    const secretDataSize = secretImageWidth * secretImageHeight * 4;
    const headerSize = 24 + 8 + 16 + 16;
    const totalSecretSize = headerSize + secretDataSize * 8 + 8;

    if (totalSecretSize > hostCapacity) {
      const maxBytes = Math.floor((hostCapacity - headerSize - 8) / 8);
      const maxPixels = Math.floor(maxBytes / 4);
      const maxDimension = Math.floor(Math.sqrt(maxPixels));

      return { width: maxDimension, height: maxDimension };
    }

    return { width: secretImageWidth, height: secretImageHeight };
  };

  const calculateProportionalSize = (
    hostWidth: number,
    hostHeight: number,
    secretWidth: number,
    secretHeight: number,
  ) => {
    const hostArea = hostWidth * hostHeight;
    const maxSecretArea = hostArea * 0.2;
    const secretAspectRatio = secretWidth / secretHeight;

    let newWidth, newHeight;
    if (secretAspectRatio >= 1) {
      newWidth = Math.floor(Math.sqrt(maxSecretArea * secretAspectRatio));
      newHeight = Math.floor(newWidth / secretAspectRatio);
    } else {
      newHeight = Math.floor(Math.sqrt(maxSecretArea / secretAspectRatio));
      newWidth = Math.floor(newHeight * secretAspectRatio);
    }

    newWidth = Math.max(32, newWidth);
    newHeight = Math.max(32, newHeight);

    return { width: newWidth, height: newHeight };
  };

  const handleSecretImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSecretBinary("");
      return;
    }
    const canvas = canvasRef2.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const hostCanvas = document.createElement("canvas");
      const hostCtx = hostCanvas.getContext("2d");
      if (!hostCtx || !imageUrl) return;

      const hostImg = new Image();
      hostImg.src = imageUrl;
      hostImg.onload = () => {
        hostCanvas.width = hostImg.width;
        hostCanvas.height = hostImg.height;
        hostCtx.drawImage(hostImg, 0, 0);
        const hostImageData = hostCtx.getImageData(
          0,
          0,
          hostCanvas.width,
          hostCanvas.height,
        );

        const proportionalSize = calculateProportionalSize(
          hostImg.width,
          hostImg.height,
          img.width,
          img.height,
        );
        const optimalSize = calculateOptimalSecretImageSize(
          hostImageData,
          proportionalSize.width,
          proportionalSize.height,
        );
        const newWidth = optimalSize.width;
        const newHeight = optimalSize.height;

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const widthBinary = newWidth.toString(2).padStart(16, "0");
        const heightBinary = newHeight.toString(2).padStart(16, "0");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const stegMark = [..."STG"]
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
          .join("");
        const imgBinary = "00000011";
        const imageDataStream = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const imageData = imageDataStream.data;

        const binary =
          stegMark +
          imgBinary +
          widthBinary +
          heightBinary +
          Array.from(imageData as Uint8ClampedArray)
            .map((byte: number): string => byte.toString(2).padStart(8, "0"))
            .join("") +
          "00000000";
        setSecretBinary(binary);
      };
    };
  };

  const encodeText = () => {
    if (!imageUrl) {
      alert("Please upload an image first");
      return;
    }

    if (mode === "Text" && !text) {
      alert("Please enter text to encode");
      return;
    }

    if (mode === "Image" && !secretBinary) {
      alert("Please select a secret image");
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

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let binaryData = "";
      if (mode === "Text") {
        const stegMark = [..."STG"]
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
          .join("");
        const txtBinary = "00000001";
        binaryData =
          stegMark +
          txtBinary +
          Array.from(text)
            .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join("") +
          "00000000";
      } else {
        binaryData = secretBinary;
      }

      const availablePixels = data.length; // All RGBA channels

      if (binaryData.length > availablePixels) {
        alert(
          `Data is too large for this image. Need ${binaryData.length} bits, but only ${availablePixels} available.`,
        );
        return;
      }

      let dataIndex = 0;
      for (let i = 0; i < binaryData.length; i++) {
        if (dataIndex >= data.length) break;

        const bit = parseInt(binaryData[i], 10);
        // const originalValue = data[dataIndex];
        data[dataIndex] = (data[dataIndex] & 0xfe) | bit;

        dataIndex++;
      }

      ctx.putImageData(imageData, 0, 0);
      setDownloadButton(true);

      if (canvasRef.current) {
        const contextCtx = canvasRef.current.getContext("2d");
        if (contextCtx) {
          contextCtx.imageSmoothingEnabled = true;
          contextCtx.imageSmoothingQuality = "high";
          contextCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
          );
          contextCtx.drawImage(canvas, 0, 0);
        }
      }
    };
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Encode</CardTitle>
        <CardDescription className="text-md">
          You can hide some text or image within an image using steganography
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="host">Host Image</Label>
          <Input
            type="file"
            accept="image/*"
            id="host"
            onChange={handleImageUpload}
          />
        </div>

        <div>
          <Button onClick={toggleMode}>
            Hide Secret {mode === "Text" ? "Image" : "Text"}
          </Button>
        </div>
        {mode === "Text" ? (
          <div>
            <div className="space-y-1">
              <Label htmlFor="secretText">Secret Text</Label>
              <Textarea
                id="secretText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to hide"
                rows={5}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <Label htmlFor="secretImage">Secret Image</Label>
            <Input
              type="file"
              accept="image/*"
              id="secretImage"
              onChange={handleSecretImage}
            />
            <canvas ref={canvasRef2} style={{ display: "none" }} />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={encodeText}
          disabled={!imageUrl || (mode === "Text" ? !text : !secretBinary)}
        >
          Encode {mode}
        </Button>
      </CardFooter>
    </Card>
  );
}
