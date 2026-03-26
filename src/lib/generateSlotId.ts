export function generateSlotId(prefix: string) {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `${prefix}${crypto.randomUUID()}`;
    }
  } catch {
    // ignore
  }
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

