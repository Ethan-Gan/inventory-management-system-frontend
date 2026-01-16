import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import './TablePage.css';

const InventoryCheckouts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [newRow, setNewRow] = useState({
    use_case: '',
    description: '',
    user_id: '',
    item_id: '',
    returned_at: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory-checkouts`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch inventory checkouts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this checkout?')) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/inventory-checkouts/${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete checkout');
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/inventory-checkouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      fetchData();
      setEditingCell(null);
    } catch (err) {
      alert('Failed to update checkout');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/inventory-checkouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });
      setNewRow({ use_case: '', description: '', user_id: '', item_id: '', returned_at: '' });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to create checkout');
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableEditing: false,
    },
    {
      accessorKey: 'use_case',
      header: 'Use Case',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-use_case`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'use_case', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'use_case', e.target.value);
              }
            }}
          />
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            {getValue()}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-description`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'description', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'description', e.target.value);
              }
            }}
          />
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            {getValue() || 'N/A'}
          </div>
        );
      },
    },
    {
      accessorKey: 'user_id',
      header: 'User ID',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-user_id`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="number"
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'user_id', parseInt(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'user_id', parseInt(e.target.value));
              }
            }}
          />
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            {getValue()}
          </div>
        );
      },
    },
    {
      accessorKey: 'item_id',
      header: 'Item ID',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-item_id`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="number"
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'item_id', parseInt(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'item_id', parseInt(e.target.value));
              }
            }}
          />
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            {getValue()}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Checked Out',
      enableEditing: false,
      cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
    },
    {
      accessorKey: 'returned_at',
      header: 'Returned At',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-returned_at`;
        const isEditing = editingCell === cellId;
        const value = getValue();
        
        return isEditing ? (
          <input
            type="datetime-local"
            autoFocus
            defaultValue={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onBlur={(e) => handleUpdate(row.original.id, 'returned_at', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'returned_at', e.target.value);
              }
            }}
          />
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            {value ? new Date(value).toLocaleString() : 'Not returned'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.id)}
          className="delete-btn"
        >
          Delete
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading) return <div className="table-page">Loading...</div>;
  if (error) return <div className="table-page error">{error}</div>;

  return (
    <div className="table-page">
      <div className="table-header">
        <h1>Inventory Checkouts Management</h1>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
            {showAddForm ? 'Cancel' : 'Add New Checkout'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="add-form">
          <input
            type="text"
            placeholder="Use Case"
            value={newRow.use_case}
            onChange={(e) => setNewRow({ ...newRow, use_case: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newRow.description}
            onChange={(e) => setNewRow({ ...newRow, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="User ID"
            value={newRow.user_id}
            onChange={(e) => setNewRow({ ...newRow, user_id: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Item ID"
            value={newRow.item_id}
            onChange={(e) => setNewRow({ ...newRow, item_id: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            placeholder="Returned At (optional)"
            value={newRow.returned_at}
            onChange={(e) => setNewRow({ ...newRow, returned_at: e.target.value })}
          />
          <button type="submit">Create Checkout</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (
                      <span>{header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽'}</span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
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
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
    </div>
  );
};

export default InventoryCheckouts;
