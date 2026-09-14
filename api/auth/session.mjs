import { handleSession } from "./_core.mjs";

export default function handler(request, response) {
  return handleSession(request, response);
}
