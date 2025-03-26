import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EncodeCard from "./EncodeCard";
import DecodeCard from "./DecodeCard";

const MainTab = () => {
  return (
    <Tabs defaultValue="encode" className="w-full h-full ">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="encode">Encode</TabsTrigger>
        <TabsTrigger value="decode">Decode</TabsTrigger>
      </TabsList>
      <TabsContent value="encode">
        <EncodeCard />
      </TabsContent>
      <TabsContent value="decode">
        <DecodeCard />
      </TabsContent>
    </Tabs>
  );
};
export { MainTab };
