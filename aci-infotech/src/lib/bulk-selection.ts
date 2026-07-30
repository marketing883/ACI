// Selection state for a paginated table where "select all" has two meanings.
//
// Ticking the header box selects the rows you can see. That is rarely what
// someone wants when a filter matches 268 candidates and the page shows 25,
// so the table also offers "select all N matching this filter". The two are
// genuinely different states, not the same one at different sizes: the second
// keeps meaning "everything the filter matches" as you page around, and it
// survives rows the browser has never rendered.
//
// Pure and separate from the component because getting this wrong exports the
// wrong people, and that is not a mistake anyone notices in a zip of 262 CVs.

export interface SelectionState {
  /** Explicitly ticked rows. Empty and meaningless while allFiltered is set. */
  ids: Set<string>;
  /** The "everything matching the filter" choice, independent of paging. */
  allFiltered: boolean;
}

export const emptySelection = (): SelectionState => ({ ids: new Set(), allFiltered: false });

export const selectAllFiltered = (): SelectionState => ({ ids: new Set(), allFiltered: true });

export function isSelected(state: SelectionState, id: string): boolean {
  return state.allFiltered || state.ids.has(id);
}

export function selectedCount(state: SelectionState, totalMatching: number): number {
  return state.allFiltered ? totalMatching : state.ids.size;
}

export function allVisibleSelected(state: SelectionState, visibleIds: string[]): boolean {
  return visibleIds.length > 0 && visibleIds.every((id) => isSelected(state, id));
}

// Unticking one row while "all filtered" is on has to collapse the state into
// a concrete set, otherwise the row appears to untick and the export still
// includes it.
export function toggleOne(state: SelectionState, id: string, allIds: string[]): SelectionState {
  if (state.allFiltered) {
    const rest = new Set(allIds);
    rest.delete(id);
    return { ids: rest, allFiltered: false };
  }
  const ids = new Set(state.ids);
  if (ids.has(id)) ids.delete(id);
  else ids.add(id);
  return { ids, allFiltered: false };
}

export function toggleVisible(
  state: SelectionState,
  visibleIds: string[],
  allIds: string[]
): SelectionState {
  if (allVisibleSelected(state, visibleIds)) {
    const ids = new Set(state.allFiltered ? allIds : state.ids);
    visibleIds.forEach((id) => ids.delete(id));
    return { ids, allFiltered: false };
  }
  const ids = new Set(state.ids);
  visibleIds.forEach((id) => ids.add(id));
  return { ids, allFiltered: false };
}

// What the export request should carry. null means "no explicit list, let the
// filter decide" - which covers both "all filtered" and nothing ticked, and
// keeps the server from having to receive thousands of ids to say "all".
export function exportIds(state: SelectionState): string[] | null {
  if (state.allFiltered || state.ids.size === 0) return null;
  return [...state.ids];
}

// Whether to offer "select all N matching this filter": only once the visible
// page is fully ticked and something matching is still unselected. Comparing
// against the page size instead of the selection would keep offering it to
// someone who had already ticked every row by hand, page by page.
export function canOfferSelectAll(
  state: SelectionState,
  visibleIds: string[],
  totalMatching: number
): boolean {
  return (
    !state.allFiltered &&
    allVisibleSelected(state, visibleIds) &&
    selectedCount(state, totalMatching) < totalMatching
  );
}
