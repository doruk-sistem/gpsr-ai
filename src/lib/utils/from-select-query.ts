export type FormatSelectQuerySelectObject<TSelectObject extends string> =
  Partial<Record<TSelectObject, boolean>>;

/**
 * Utility function to handle select parameters for __Supabase queries__.
 *
 * @param selectObject - The object containing the fields to select.
 * @returns A string of the selected fields. Default is `*`.
 */
export const formatSelectQuery = <TSelectObject extends string>(
  selectObject: FormatSelectQuerySelectObject<TSelectObject> | undefined
): string => {
  if (
    !selectObject ||
    typeof selectObject !== "object" ||
    Object.keys(selectObject).length === 0
  ) {
    return "*";
  }

  return Object.keys(selectObject).join(", ");
};
