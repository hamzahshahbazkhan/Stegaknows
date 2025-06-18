import { MainTab } from "@/components/Tabs";
import SideTab from "@/components/SideTab";
import { Navbar } from "@/components/Navbar";
import { CanvasProvider } from "@/contexts/canvasContext";

export default function Home() {
  return (
    <CanvasProvider>
      {" "}
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-row bg-bg flex-grow">
          <div className="w-1/2 flex items-stretch h-[calc(100vh-108px)] p-12">
            <MainTab />
          </div>
          <div className="w-1/2 flex items-stretch h-[calc(100vh-108px)] p-12">
            <SideTab />
          </div>
        </div>
      </div>
    </CanvasProvider>
  );
}
