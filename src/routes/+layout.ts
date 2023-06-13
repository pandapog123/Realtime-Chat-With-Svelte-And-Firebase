import type { LayoutLoad } from "./$types";

export const ssr = false;

export const load = (async (req) => {
  return {
    auth: await import("../firebase/auth"),
    firestore: await import("../firebase/firestore"),
  };
}) satisfies LayoutLoad;
