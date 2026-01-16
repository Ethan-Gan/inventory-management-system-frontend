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

const PurchaseRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [newRow, setNewRow] = useState({
    item_name: '',
    description: '',
    purchase_cost: 0,
    status: 'pending',
    purchase_website_url: '',
    supplier_id: '',
    user_id: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/purchase-requests`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch purchase requests');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this purchase request?')) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/purchase-requests/${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete purchase request');
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/purchase-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      fetchData();
      setEditingCell(null);
    } catch (err) {
      alert('Failed to update purchase request');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/purchase-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });
      setNewRow({ item_name: '', description: '', purchase_cost: 0, status: 'pending', purchase_website_url: '', supplier_id: '', user_id: '' });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to create purchase request');
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableEditing: false,
    },
    {
      accessorKey: 'item_name',
      header: 'Item Name',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-item_name`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'item_name', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'item_name', e.target.value);
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
      accessorKey: 'purchase_cost',
      header: 'Cost',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-purchase_cost`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="number"
            step="0.01"
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'purchase_cost', parseFloat(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'purchase_cost', parseFloat(e.target.value));
              }
            }}
          />
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            ${parseFloat(getValue()).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-status`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <select
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'status', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'status', e.target.value);
              }
            }}
          >
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="completed">completed</option>
          </select>
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            <span className={`status-badge status-${getValue()}`}>{getValue()}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'supplier_id',
      header: 'Supplier ID',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-supplier_id`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="number"
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'supplier_id', parseInt(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'supplier_id', parseInt(e.target.value));
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
      accessorKey: 'created_at',
      header: 'Created At',
      enableEditing: false,
      cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
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
        <h1>Purchase Requests Management</h1>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
            {showAddForm ? 'Cancel' : 'Add New Request'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="add-form">
          <input
            type="text"
            placeholder="Item Name"
            value={newRow.item_name}
            onChange={(e) => setNewRow({ ...newRow, item_name: e.target.value })}
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
            step="0.01"
            placeholder="Purchase Cost"
            value={newRow.purchase_cost}
            onChange={(e) => setNewRow({ ...newRow, purchase_cost: parseFloat(e.target.value) })}
            required
          />
          <select
            value={newRow.status}
            onChange={(e) => setNewRow({ ...newRow, status: e.target.value })}
          >
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="completed">completed</option>
          </select>
          <input
            type="url"
            placeholder="Purchase Website URL"
            value={newRow.purchase_website_url}
            onChange={(e) => setNewRow({ ...newRow, purchase_website_url: e.target.value })}
          />
          <input
            type="number"
            placeholder="Supplier ID"
            value={newRow.supplier_id}
            onChange={(e) => setNewRow({ ...newRow, supplier_id: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="User ID"
            value={newRow.user_id}
            onChange={(e) => setNewRow({ ...newRow, user_id: e.target.value })}
            required
          />
          <button type="submit">Create Request</button>
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

export default PurchaseRequests;
