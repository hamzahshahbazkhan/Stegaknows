import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EncodeCard from "./EncodeCard";
import DecodeCard from "./DecodeCard";

const MainTab = () => {
  return (
    <Tabs
      defaultValue="encode"
      className="w-full h-full min-h-0 flex flex-col overflow-hidden"
    >
      <TabsList className="grid w-full grid-cols-2 shrink-0">
        <TabsTrigger value="encode">Encode</TabsTrigger>
        <TabsTrigger value="decode">Decode</TabsTrigger>
      </TabsList>
      <TabsContent
        value="encode"
        className="flex-1 min-h-0 overflow-auto mt-2"
      >
        <EncodeCard />
      </TabsContent>
      <TabsContent
        value="decode"
        className="flex-1 min-h-0 overflow-auto mt-2"
      >
        <DecodeCard />
      </TabsContent>
    </Tabs>
  );
};
export { MainTab };
