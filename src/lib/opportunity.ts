type IdLike = string | { _id?: string; id?: string } | null | undefined;

function resolveId(value: IdLike): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "object") {
    const id = value._id ?? value.id;
    return id != null ? String(id) : undefined;
  }
  return String(value);
}

export function isOpportunityOwner(
  user: { _id?: string; id?: string } | null | undefined,
  opportunity: { owner?: IdLike; createdBy?: IdLike } | null | undefined,
): boolean {
  const ownerId = resolveId(opportunity?.owner ?? opportunity?.createdBy);
  const currentUserId = resolveId(user);
  return Boolean(ownerId && currentUserId && ownerId === currentUserId);
}
