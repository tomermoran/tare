import { getFormatter, getTranslations } from "next-intl/server";
import { RunOutLineLive } from "@/components/beans/RunOutLineLive";
import { runOutContent } from "@/lib/runOutContent";
import { getRunOut } from "@/server/dal/runOut";
import { getTimeZone } from "@/server/time";

/** The run-out line under On hand (EPIC-03-05), read on its own so Beans never waits on it or fails with it. */
export async function RunOut() {
  const [t, format, timeZone] = await Promise.all([getTranslations(), getFormatter(), getTimeZone()]);
  const view = await getRunOut(new Date());
  return (
    <RunOutLineLive
      content={runOutContent(view, { t, format, timeZone })}
      labels={{ title: t("beans.runOutTitle"), close: t("actions.close"), loadFailed: t("states.loadFailed"), retry: t("actions.retry") }}
    />
  );
}
