import { SetupScreen } from "@/components/screens/SetupScreen/SetupScreen";
import { ADD_PART_PATH } from "@/lib/setupRoutes";
import { setupLabels } from "./labels";

export default async function SetupLoading() {
  const none = { machine: [], grinder: [], basket: [] };
  return <SetupScreen state="loading" parts={none} addPartHref={ADD_PART_PATH} addMachineHref={ADD_PART_PATH} labels={await setupLabels()} />;
}
