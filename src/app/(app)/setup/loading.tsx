import { SetupScreen } from "@/components/screens/SetupScreen/SetupScreen";
import { ADD_PART, setupLabels } from "./labels";

export default async function SetupLoading() {
  const none = { machine: [], grinder: [], basket: [] };
  return <SetupScreen state="loading" parts={none} addPartHref={ADD_PART} addMachineHref={ADD_PART} labels={await setupLabels()} />;
}
