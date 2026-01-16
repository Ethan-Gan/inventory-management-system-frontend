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

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [newRow, setNewRow] = useState({
    username: '',
    password_hash: '',
    role: 'user',
    email: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      fetchData();
      setEditingCell(null);
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });
      setNewRow({ username: '', password_hash: '', role: 'user', email: '' });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to create user');
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableEditing: false,
    },
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-username`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'username', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'username', e.target.value);
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
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-email`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="email"
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'email', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'email', e.target.value);
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
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-role`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'role', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'role', e.target.value);
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
        <h1>Users Management</h1>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
            {showAddForm ? 'Cancel' : 'Add New User'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="add-form">
          <input
            type="text"
            placeholder="Username"
            value={newRow.username}
            onChange={(e) => setNewRow({ ...newRow, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newRow.password_hash}
            onChange={(e) => setNewRow({ ...newRow, password_hash: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={newRow.email}
            onChange={(e) => setNewRow({ ...newRow, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            value={newRow.role}
            onChange={(e) => setNewRow({ ...newRow, role: e.target.value })}
            required
          />
          <button type="submit">Create User</button>
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

export default Users;
