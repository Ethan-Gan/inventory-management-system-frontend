import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';

/**
 * Shared table + pagination renderer used by every management page.
 * Includes draggable column resizers (the thin white dividers between columns).
 *
 * The parent passes a configured TanStack `table` instance. To enable the
 * resize handles, the table must be created with:
 *   enableColumnResizing: true,
 *   columnResizeMode: 'onChange',
 */
const DataTable = ({ table }) => {
  // Only columns that are allowed to hide show up as toggles. The actions
  // column opts out via `enableHiding: false`, so it is always visible and
  // never listed here.
  const toggleableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  // getAllLeafColumns() returns definition order, which ignores reordering.
  // Sort the toggles by the live column order (including hidden columns) so
  // the pills always match the table's current column arrangement.
  const currentOrder =
    table.getState().columnOrder.length > 0
      ? table.getState().columnOrder
      : table.getAllLeafColumns().map((c) => c.id);
  const orderIndex = (columnId) => {
    const index = currentOrder.indexOf(columnId);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const orderedToggleColumns = [...toggleableColumns].sort(
    (a, b) => orderIndex(a.id) - orderIndex(b.id)
  );

  // --- Column reordering via native drag-and-drop ---
  const [draggedColId, setDraggedColId] = useState(null);
  const [dragOverColId, setDragOverColId] = useState(null);

  // Whether a column is actively being resized. We read this straight from
  // TanStack's own state so it is always accurate and self-clearing - no
  // manual mouseup bookkeeping that can get stuck and wrongly block dragging.
  const isResizing = Boolean(
    table.getState().columnSizingInfo.isResizingColumn
  );

  // The actions column stays pinned; it is neither draggable nor a drop target.
  const isReorderable = (columnId) => columnId !== 'actions';

  const getCurrentOrder = () =>
    table.getState().columnOrder.length
      ? [...table.getState().columnOrder]
      : table.getAllLeafColumns().map((c) => c.id);

  const handleDrop = (targetColId) => {
    if (
      !draggedColId ||
      draggedColId === targetColId ||
      !isReorderable(targetColId) ||
      !isReorderable(draggedColId)
    ) {
      return;
    }
    const order = getCurrentOrder();
    const from = order.indexOf(draggedColId);
    const to = order.indexOf(targetColId);
    if (from === -1 || to === -1) return;
    order.splice(from, 1);
    order.splice(to, 0, draggedColId);
    table.setColumnOrder(order);
  };

  return (
    <>
      <div className="column-toggles">
        <span className="column-toggles-label">Columns:</span>
        {orderedToggleColumns.map((column) => {
          const colId = column.id;
          const classNames = [
            'column-toggle',
            dragOverColId === colId && draggedColId ? 'column-toggle-drag-over' : '',
            draggedColId === colId ? 'column-toggle-dragging' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <label
              key={colId}
              className={classNames}
              draggable
              onDragStart={() => setDraggedColId(colId)}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOverColId(colId);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(colId);
                setDraggedColId(null);
                setDragOverColId(null);
              }}
              onDragEnd={() => {
                setDraggedColId(null);
                setDragOverColId(null);
              }}
            >
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              <span>
                {typeof column.columnDef.header === 'string'
                  ? column.columnDef.header
                  : column.id}
              </span>
            </label>
          );
        })}
      </div>

      <div className="table-container">
        <table style={{ width: table.getCenterTotalSize() }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const colId = header.column.id;
                  const canReorder = isReorderable(colId);
                  const classNames = [
                    canReorder ? 'th-draggable' : '',
                    dragOverColId === colId && draggedColId && canReorder
                      ? 'th-drag-over'
                      : '',
                    draggedColId === colId ? 'th-dragging' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <th
                      key={header.id}
                      className={classNames}
                      style={{ width: header.getSize() }}
                      draggable={canReorder && !isResizing}
                      onClick={header.column.getToggleSortingHandler()}
                      onDragStart={() => canReorder && setDraggedColId(colId)}
                      onDragEnter={(e) => {
                        if (!canReorder) return;
                        e.preventDefault();
                        setDragOverColId(colId);
                      }}
                      onDragOver={(e) => {
                        if (canReorder) e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDrop(colId);
                        setDraggedColId(null);
                        setDragOverColId(null);
                      }}
                      onDragEnd={() => {
                        setDraggedColId(null);
                        setDragOverColId(null);
                      }}
                    >
                      <span className="th-content">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          <span>
                            {header.column.getIsSorted() === 'asc'
                              ? ' 🔼'
                              : ' 🔽'}
                          </span>
                        )}
                      </span>
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onClick={(e) => e.stopPropagation()}
                          className={`col-resizer ${
                            header.column.getIsResizing() ? 'is-resizing' : ''
                          }`}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default DataTable;
