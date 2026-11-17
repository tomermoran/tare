import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Notice } from "@/components/ui/Notice/Notice";
import { cx } from "@/lib/cx";

/*
 * SCR-PROFILE (STORY-01-01-03): the profile name, Your lists, the Account
 * section and the app's name and version, in that order (design pattern 4;
 * People is added by its epic). Props only. The name field is empty
 * until renamed, with the role label in its hint, not as a placeholder.
 * A failed save keeps the typed name (AC 6).
 *
 * Account (STORY-05-03-01): not linked, a calm sentence and a plain text
 * button with no Google logo or colour (`linkAction`, with its notices);
 * linked, a statement and nothing to unlink or sign out. Nothing from the
 * Google account is shown.
 *
 * Your lists (STORY-02-05-07): Drinks and Milks, each a row with a one-line
 * summary ("9 drinks, 2 hidden") and a chevron that mirrors right to left.
 */

/** A row of Your lists: where it goes and its summary, already formatted. */
export type ProfileList = { href: string; summary: string };

export type ProfileLabels = {
  back: string;
  title: string;
  name: string;
  /** Names the role label, e.g. "…you're shown as “Me”." */
  nameHint: string;
  save: string;
  saved: string;
  saveFailed: string;
  listsTitle: string;
  /** The People section's title and row (EPIC-05-01). */
  peopleTitle?: string;
  people?: string;
  drinks: string;
  milks: string;
  accountTitle: string;
  /** Not linked: where the history lives and what linking does. */
  account: string;
  linked: string;
  linkedBody: string;
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
  linked = false,
  linkAction,
  lists,
  people,
}: {
  labels: ProfileLabels;
  backHref: string;
  name: string;
  onNameChange: (name: string) => void;
  /** The form's action (useActionState's dispatcher). */
  action: (form: FormData) => void;
  status?: "idle" | "saved" | "failed";
  pending?: boolean;
  linked?: boolean;
  /** The link button and what it says when it fails; shown while not linked. */
  linkAction?: ReactNode;
  /** Your lists; absent until they're known. */
  lists?: { drinks: ProfileList; milks: ProfileList };
  /** The people brewed for, opening SCR-PEOPLE ("Just you"); absent until known. */
  people?: ProfileList;
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

      {people && (
        <section aria-labelledby="profile-people" className="flex flex-col gap-2">
          <h2 id="profile-people" className="text-h3 text-ink">
            {labels.peopleTitle}
          </h2>
          <ListRow href={people.href} primary={labels.people} secondary={people.summary} end={<Icon name="chevron" className="text-ink-secondary" />} />
        </section>
      )}

      {lists && (
        <section aria-labelledby="profile-lists" className="flex flex-col gap-2">
          <h2 id="profile-lists" className="text-h3 text-ink">
            {labels.listsTitle}
          </h2>
          <div className="flex flex-col">
            <ListRow href={lists.drinks.href} primary={labels.drinks} secondary={lists.drinks.summary} end={<Icon name="chevron" className="text-ink-secondary" />} />
            <ListRow href={lists.milks.href} primary={labels.milks} secondary={lists.milks.summary} end={<Icon name="chevron" className="text-ink-secondary" />} />
          </div>
        </section>
      )}

      <section aria-labelledby="profile-account" className="flex flex-col gap-2">
        <h2 id="profile-account" className="text-h3 text-ink">
          {labels.accountTitle}
        </h2>
        {linked ? (
          <>
            <p className="text-h3 font-light text-ink">{labels.linked}</p>
            <p className="text-body text-ink-secondary">{labels.linkedBody}</p>
          </>
        ) : (
          <>
            <p className="text-body text-ink">{labels.account}</p>
            {linkAction && <div className="mt-2 flex flex-col items-start gap-4">{linkAction}</div>}
          </>
        )}
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
