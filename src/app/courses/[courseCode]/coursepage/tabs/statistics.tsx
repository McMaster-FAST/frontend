import { TabsContent } from "@radix-ui/react-tabs";

export default function StatisticsTab() {
  return (
    <TabsContent
      value="statistics"
      className="mt-0 flex-1 overflow-y-auto min-h-0 pr-2"
    >
      <div className="rounded-lg border border-dashed border-light-gray p-10 text-center text-dark-gray">
        Statistics Dashboard Coming Soon
      </div>
    </TabsContent>
  );
}
