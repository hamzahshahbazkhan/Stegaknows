import { MainTab } from "@/components/Tabs";
import SideTab from "@/components/SideTab";
import { Navbar } from "@/components/Navbar";
import { CanvasProvider } from "@/contexts/canvasContext";

export default function Home() {
  return (
    <CanvasProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-row bg-bg flex-1 min-h-0">
          <div className="w-1/2 flex min-h-0 h-[calc(100vh-108px)] p-12 overflow-hidden">
            <MainTab />
          </div>
          <div className="w-1/2 flex min-h-0 h-[calc(100vh-108px)] p-12 overflow-hidden">
            <SideTab />
          </div>
        </div>
      </div>
    </CanvasProvider>
  );
}
