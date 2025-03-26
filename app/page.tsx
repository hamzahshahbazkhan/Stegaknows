import { MainTab } from "@/components/Tabs";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-row bg-bg flex-grow p-12">
        <div className="w-1/2 flex items-center justify-center h-full">
          <MainTab />
        </div>
        <div className="w-1/2 flex items-center justify-center h-full">
          <div>hello world</div>
        </div>
      </div>
    </div>
  );
}
