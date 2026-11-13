import Link from "next/link";
import { Button, buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { cx } from "@/lib/cx";

/*
 * SCR-PROFILE (STORY-01-01-03): the profile name, where history is kept,
 * and the app's name and version. Props only. The name field is empty
 * until renamed, with the role label in its hint, not as a placeholder.
 * The device sentence is calm and factual: ink, body text, never signal
 * (AC 5). A failed save keeps the typed name (AC 6).
 */

export type ProfileLabels = {
  back: string;
  title: string;
  name: string;
  /** Names the role label, e.g. "…you're shown as “Me”." */
  nameHint: string;
  save: string;
  saved: string;
  saveFailed: string;
  deviceTitle: string;
  device: string;
  about: string;
  appName: string;
  /** "Version 0.1.0", already formatted. */
  version: string;
};

export function ProfileScreen({
  labels,
  backHref,
  name,
  onNameChange,
  action,
  status = "idle",
  pending = false,
}: {
  labels: ProfileLabels;
  backHref: string;
  name: string;
  onNameChange: (name: string) => void;
  /** The form's action (useActionState's dispatcher). */
  action: (form: FormData) => void;
  status?: "idle" | "saved" | "failed";
  pending?: boolean;
}) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Link href={backHref} className={cx(buttonClass({ variant: "ghost", size: "sm" }), "self-start")}>
          <Icon name="back" />
          {labels.back}
        </Link>
        <h1 className="text-h1">{labels.title}</h1>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <Input
          name="name"
          label={labels.name}
          hint={labels.nameHint}
          value={name}
          maxLength={40}
          autoComplete="nickname"
          onChange={(e) => onNameChange(e.target.value)}
        />
        {status === "failed" && <Notice urgent>{labels.saveFailed}</Notice>}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" disabled={pending} aria-busy={pending || undefined}>
            {labels.save}
          </Button>
          <p role="status" className="text-label text-ink-secondary">
            {status === "saved" && !pending ? labels.saved : ""}
          </p>
        </div>
      </form>

      <section aria-labelledby="profile-device" className="flex flex-col gap-2">
        <h2 id="profile-device" className="text-h3 text-ink">
          {labels.deviceTitle}
        </h2>
        <p className="text-body text-ink">{labels.device}</p>
      </section>

      <section aria-labelledby="profile-about" className="flex flex-col gap-2">
        <h2 id="profile-about" className="text-h3 text-ink">
          {labels.about}
        </h2>
        <p className="text-body text-ink">{labels.appName}</p>
        <p className="text-label text-ink-secondary">{labels.version}</p>
      </section>
    </div>
  );
}
