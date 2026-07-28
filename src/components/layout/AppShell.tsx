import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, usePathname } from "expo-router";
import { PropsWithChildren } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/Badge";
import { SwitchControl } from "@/components/ui/SwitchControl";
import { AppDispatch, RootState } from "@/store";
import { cancelActiveSyncRequest } from "@/services/api";
import { setIsOnline } from "@/store/slices/appSlice";
import { setSyncStatus } from "@/store/slices/syncSlice";
import { runSyncNow } from "@/store/thunks/syncThunks";

const navItems = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/focus", icon: "timer", label: "Focus" },
  { href: "/syllabus", icon: "book", label: "Learn" },
  { href: "/sync", icon: "swap-horizontal", label: "Sync" },
  { href: "/notifications", icon: "notifications", label: "Alerts" }
] as const;

export function AppShell({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { isOnline, selectedDeviceId } = useSelector((state: RootState) => state.app);

  function toggleNetwork() {
    const nextOnlineState = !isOnline;
    dispatch(setIsOnline(nextOnlineState)); // This is the online/offline state code which will synchronize all of the pages 
    dispatch(setSyncStatus(nextOnlineState ? "idle" : "offline")); // This is the sync status code which will trigger the sync logic to either start syncing or stop syncing based on the network state
    if (nextOnlineState) {
      void dispatch(runSyncNow());
    } else {
      cancelActiveSyncRequest();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f5f2ff]">
      <View className="flex-1 md:flex-row">
        <View className="hidden w-72 bg-violetDeep p-5 md:flex">
          <Text className="text-3xl font-bold text-white">FocusSync</Text>
          <Text className="mt-1 text-sm font-semibold text-white/70">Offline Study Coach</Text>
          <View className="mt-6 gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} asChild>
                <Pressable
                  className={`flex-row items-center gap-3 rounded-2xl px-4 py-3 ${
                    pathname === item.href ? "bg-white" : "bg-transparent"
                  }`}
                >
                  <Ionicons
                    color={pathname === item.href ? "#4b2fc9" : "#ffffff"}
                    name={item.icon}
                    size={18}
                  />
                  <Text
                    className={`font-bold ${
                      pathname === item.href ? "text-violetDeep" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View className="flex-1">
          <LinearGradient
            colors={["#7357f5", "#4b2fc9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingBottom: 16, paddingHorizontal: 20, paddingTop: 16 }}
          >
            <View className="mx-auto w-full max-w-5xl">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
                    <Text className="text-lg font-bold text-violetDeep">A</Text>
                  </View>
                  <View>
                    <Text className="text-[11px] font-bold uppercase text-white/70">Welcome back</Text>
                    <Text className="text-lg font-bold text-white">Quinn Hoa</Text>
                    <Text className="text-xs font-semibold text-white/70">Grade 10 · {selectedDeviceId}</Text>
                  </View>
                </View>
                <SwitchControl enabled={isOnline} onToggle={toggleNetwork} />
              </View>

              <View className="mt-3 flex-row flex-wrap gap-2">
                <Badge label="Offline-ready" tone="light" />
                <Badge label="Multi-device" tone="light" />
              </View>
            </View>
          </LinearGradient>

          <ScrollView contentContainerClassName="px-4 pb-28 pt-4 md:px-6 md:pb-8">
            <View className="mx-auto w-full max-w-5xl gap-4">{children}</View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 border-t border-violetSoft bg-white px-3 py-2 z-50 md:hidden" style={{ zIndex: 50 }}>
            <View className="flex-row justify-between rounded-3xl bg-white">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} asChild>
                  <Pressable
                    className={`flex-1 items-center rounded-2xl px-1 py-3 ${
                      pathname === item.href ? "bg-violetSoft" : "bg-white"
                    }`}
                  >
                    <Ionicons
                      color={pathname === item.href ? "#4b2fc9" : "#746f8a"}
                      name={item.icon}
                      size={18}
                    />
                    <Text
                      className={`mt-1 text-[11px] font-bold ${
                        pathname === item.href ? "text-violetDeep" : "text-muted"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
