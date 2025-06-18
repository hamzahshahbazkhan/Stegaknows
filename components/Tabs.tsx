import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EncodeCard from "./EncodeCard";
import DecodeCard from "./DecodeCard";

const MainTab = () => {
  return (
    <Tabs defaultValue="encode" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="encode">Encode</TabsTrigger>
        <TabsTrigger value="decode">Decode</TabsTrigger>
      </TabsList>
      <TabsContent value="encode" className="h-full flex-grow overflow-hidden">
        <EncodeCard />
      </TabsContent>
      <TabsContent value="decode" className="h-full flex-grow overflow-hidden">
        <DecodeCard />
      </TabsContent>
    </Tabs>
  );
};
export { MainTab };
