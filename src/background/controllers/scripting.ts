import Tabs from "../../chrome-api/tabs";

export async function getAllScriptableTabs() {
  const tabs = await Tabs.getAllTabs({
    allWindows: true,
  });
  return tabs
    .filter((tab) => tab.url)
    .filter((tab) => tab.url!.startsWith("http"))
    .map((tab) => tab.id);
}
