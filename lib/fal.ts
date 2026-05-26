import { fal } from "@fal-ai/client";

if (process.env.FAL_KEY) {
  fal.config({ credentials: process.env.FAL_KEY });
}

export { fal };
export const falConfigured = !!process.env.FAL_KEY;
