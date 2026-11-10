import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import DataTable from '../components/DataTable';
import './TablePage.css';

const InventoryItems = () => {
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [newRow, setNewRow] = useState({
    item_name: '',
    replacement_cost: 0,
    is_functional: true,
    technical_reference_url: '',
    supplier_id: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory-items`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch inventory items');
      setLoading(false);
    }
  };

  // Load referenced records so we can show names instead of raw IDs.
  const fetchLookups = async () => {
    try {
      const suppliersRes = await fetch(`${import.meta.env.VITE_API_URL}/suppliers`);
      setSuppliers(await suppliersRes.json());
    } catch (err) {
      // Non-fatal: fall back to showing the raw IDs.
    }
  };

  useEffect(() => {
    fetchData();
    fetchLookups();
  }, []);

  const supplierName = (id) => {
    const supplier = suppliers.find((s) => s.id === id);
    return supplier ? supplier.name : null;
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/inventory-items/${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/inventory-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      fetchData();
      setEditingCell(null);
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/inventory-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });
      setNewRow({ item_name: '', replacement_cost: 0, is_functional: true, technical_reference_url: '', supplier_id: '' });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to create item');
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
      accessorKey: 'replacement_cost',
      header: 'Replacement Cost',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-replacement_cost`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="number"
            step="0.01"
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'replacement_cost', parseFloat(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'replacement_cost', parseFloat(e.target.value));
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
      accessorKey: 'is_functional',
      header: 'Functional',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-is_functional`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <select
            autoFocus
            defaultValue={getValue() ? 'true' : 'false'}
            onBlur={(e) => handleUpdate(row.original.id, 'is_functional', e.target.value === 'true')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'is_functional', e.target.value === 'true');
              }
            }}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            {getValue() ? '✓ Yes' : '✗ No'}
          </div>
        );
      },
    },
    {
      accessorKey: 'technical_reference_url',
      header: 'Technical Reference',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-technical_reference_url`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="url"
            autoFocus
            defaultValue={getValue()}
            onBlur={(e) => handleUpdate(row.original.id, 'technical_reference_url', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate(row.original.id, 'technical_reference_url', e.target.value);
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
      accessorKey: 'supplier_id',
      header: 'Supplier',
      cell: ({ row, getValue }) => {
        const cellId = `${row.original.id}-supplier_id`;
        const isEditing = editingCell === cellId;
        const id = getValue();
        const name = supplierName(id);

        return isEditing ? (
          <select
            autoFocus
            defaultValue={id ?? ''}
            onBlur={(e) => handleUpdate(row.original.id, 'supplier_id', parseInt(e.target.value))}
            onChange={(e) => handleUpdate(row.original.id, 'supplier_id', parseInt(e.target.value))}
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        ) : (
          <div onClick={() => setEditingCell(cellId)} style={{ cursor: 'pointer' }}>
            {name || `#${id}`}
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
      enableHiding: false,
      enableResizing: false,
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
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
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
        <h1>Inventory Items Management</h1>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
            {showAddForm ? 'Cancel' : 'Add New Item'}
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
            type="number"
            step="0.01"
            placeholder="Replacement Cost"
            value={newRow.replacement_cost}
            onChange={(e) => setNewRow({ ...newRow, replacement_cost: parseFloat(e.target.value) })}
            required
          />
          <select
            value={newRow.is_functional ? 'true' : 'false'}
            onChange={(e) => setNewRow({ ...newRow, is_functional: e.target.value === 'true' })}
          >
            <option value="true">Functional</option>
            <option value="false">Not Functional</option>
          </select>
          <input
            type="url"
            placeholder="Technical Reference URL"
            value={newRow.technical_reference_url}
            onChange={(e) => setNewRow({ ...newRow, technical_reference_url: e.target.value })}
          />
          <select
            value={newRow.supplier_id}
            onChange={(e) => setNewRow({ ...newRow, supplier_id: e.target.value })}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button type="submit">Create Item</button>
        </form>
      )}

      <DataTable table={table} />
    </div>
  );
};

export default InventoryItems;
