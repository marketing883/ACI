#!/usr/bin/env tsx
/**
 * Selection state for the paginated applications table.
 *
 * The case that matters: a filter matches 268 candidates, the page shows 25,
 * someone picks "select all 268", then unticks one. If that does not collapse
 * into a concrete set, the row unticks on screen and the export still contains
 * them. Nobody catches that in a zip of 262 CVs.
 *
 * Usage:
 *   cd aci-infotech
 *   npx tsx scripts/test-bulk-selection.ts
 */
import {
  allVisibleSelected,
  canOfferSelectAll,
  emptySelection,
  exportIds,
  isSelected,
  selectAllFiltered,
  selectedCount,
  toggleOne,
  toggleVisible,
} from '../src/lib/bulk-selection';

let failures = 0;
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}`, extra ?? '');
  }
}

// 268 matching, 25 per page, as with the APAC role.
const allIds = Array.from({ length: 268 }, (_, i) => `app-${i + 1}`);
const page1 = allIds.slice(0, 25);
const page2 = allIds.slice(25, 50);

console.log('1. Nothing selected:');
{
  const s = emptySelection();
  check('count is zero', selectedCount(s, allIds.length) === 0);
  check('export falls back to the filter', exportIds(s) === null);
  check('no select-all offer yet', !canOfferSelectAll(s, page1, allIds.length));
}

console.log('2. Header checkbox selects the visible page only:');
{
  const s = toggleVisible(emptySelection(), page1, allIds);
  check('25 selected, not 268', selectedCount(s, allIds.length) === 25, selectedCount(s, allIds.length));
  check('a row on this page is selected', isSelected(s, 'app-1'));
  check('a row on page 2 is not', !isSelected(s, 'app-26'));
  check('export carries 25 ids', exportIds(s)?.length === 25);
  check('now offers select-all', canOfferSelectAll(s, page1, allIds.length));
}

console.log('3. Select all matching the filter:');
{
  const s = selectAllFiltered();
  check('counts every match, including unrendered rows',
    selectedCount(s, allIds.length) === 268, selectedCount(s, allIds.length));
  check('a row never rendered is selected', isSelected(s, 'app-268'));
  check('export uses the filter, not 268 ids in a URL', exportIds(s) === null);
  check('no further select-all offer', !canOfferSelectAll(s, page1, allIds.length));
  check('page 2 shows as fully selected', allVisibleSelected(s, page2));
}

console.log('4. Unticking one while all-filtered is on:');
{
  const s = toggleOne(selectAllFiltered(), 'app-100', allIds);
  check('collapses to a concrete set', s.allFiltered === false);
  check('267 remain', selectedCount(s, allIds.length) === 267, selectedCount(s, allIds.length));
  check('the unticked row is really out', !isSelected(s, 'app-100'));
  check('and is absent from the export list', !exportIds(s)?.includes('app-100'));
  check('everything else survives', exportIds(s)?.length === 267);
}

console.log('5. Unticking the header while all-filtered is on:');
{
  const s = toggleVisible(selectAllFiltered(), page1, allIds);
  check('drops exactly the visible page', selectedCount(s, allIds.length) === 243, selectedCount(s, allIds.length));
  check('page 1 rows are out', !isSelected(s, 'app-1') && !isSelected(s, 'app-25'));
  check('page 2 rows remain', isSelected(s, 'app-26'));
}

console.log('6. Selection accumulates across pages:');
{
  let s = toggleVisible(emptySelection(), page1, allIds);
  s = toggleVisible(s, page2, allIds);
  check('both pages held', selectedCount(s, allIds.length) === 50, selectedCount(s, allIds.length));
  s = toggleVisible(s, page1, allIds);
  check('unticking page 1 leaves page 2', selectedCount(s, allIds.length) === 25);
  check('the survivors are page 2', isSelected(s, 'app-26') && !isSelected(s, 'app-1'));
}

console.log('7. Single row toggling:');
{
  let s = toggleOne(emptySelection(), 'app-7', allIds);
  check('selects', isSelected(s, 'app-7') && selectedCount(s, allIds.length) === 1);
  s = toggleOne(s, 'app-7', allIds);
  check('deselects', !isSelected(s, 'app-7') && selectedCount(s, allIds.length) === 0);
  check('back to filter-based export', exportIds(s) === null);
}

console.log('8. Everything ticked by hand:');
{
  let s = emptySelection();
  for (let i = 0; i < allIds.length; i += 25) s = toggleVisible(s, allIds.slice(i, i + 25), allIds);
  check('all 268 ticked individually', selectedCount(s, allIds.length) === 268);
  check('still sends an explicit list', exportIds(s)?.length === 268);
  check('no select-all offer, nothing left to add', !canOfferSelectAll(s, page1, allIds.length));
}

console.log('9. Single page of results:');
{
  const few = ['a', 'b', 'c'];
  const s = toggleVisible(emptySelection(), few, few);
  check('no select-all offer when the page is everything',
    !canOfferSelectAll(s, few, few.length));
  check('empty page is not "all selected"', !allVisibleSelected(emptySelection(), []));
}

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
