import type { SetupChoice } from "@/domain/currentSetup";
import { testContext } from "./context";

// Stands in for @/server/setupChoice: the cookie lives in testContext, so a
// test can set or read the device's choice. Reset it in beforeEach.

export async function readSetupChoice(): Promise<SetupChoice | null> {
  return testContext.setupChoice;
}

export async function writeSetupChoice(setupId: string, at = new Date()): Promise<void> {
  testContext.setupChoice = { setupId, at: at.getTime() };
}
