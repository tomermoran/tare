/** Setup routes shared by the Setup tab, the builder and the add-part task. */
export const SETUP_PATH = "/setup";
export const ADD_PART_PATH = "/setup/add-part";
export const BUILDER_PATH = "/setup/builder";

/** The builder, starting from a setup's three parts (STORY-01-02-08 AC 1). */
export const changePartHref = (setupId: string) => `${BUILDER_PATH}?from=${encodeURIComponent(setupId)}`;

/** The builder, starting from the current setup with a new part swapped in (AC 5). */
export const newPartBuilderHref = (partId: string) => `${BUILDER_PATH}?newPart=${encodeURIComponent(partId)}`;

/** One part (SCR-UNIT). */
export const partHref = (partId: string) => `${SETUP_PATH}/parts/${encodeURIComponent(partId)}`;
