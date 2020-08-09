/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Paginates results
 * @param cursor Cursor
 * @param results Array of items to paginate
 * @param pageSize Size of page, defaults to 20
 * @param getCursor custom cursor function, if none is provided, this is defaulted
 */
export const paginateResults = (
  cursor: any,
  results: any[],
  pageSize = 20,
  getCursor: (item: any) => null = () => null,
): any[] => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);

  const cursorIndex = results.findIndex((item: any) => {
    // if an ietem has a cursor on it, use that, otherwise, generate one

    const itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there is still no cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + pageSize))
    : results.slice(0, pageSize);
};
