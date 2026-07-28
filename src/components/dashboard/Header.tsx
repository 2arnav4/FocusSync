import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/Badge";
import { RootState } from "@/store";

export function Header() {
  const { isOnline, selectedDeviceId } = useSelector((state: RootState) => state.app);

  return (
    <View className="rounded-lg border border-slate-200 bg-white p-5">
      <View className="flex-row flex-wrap items-center justify-between gap-3">
        <View>
          <Text className="text-3xl font-bold text-ink">FocusSync</Text>
          <Text className="mt-1 text-sm text-muted">Grade 10 study dashboard</Text>
        </View>
        <View className="flex-row gap-2">
          <Badge label={`Device: ${selectedDeviceId}`} tone="blue" />
          <Badge label={isOnline ? "Online" : "Offline"} tone={isOnline ? "green" : "clay"} />
        </View>
      </View>
    </View>
  );
}
