'use client';

import { Link } from '@/i18n/navigation';
import { useCallback, useMemo, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowLeft, ArrowRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { formatETB } from '@/lib/data';
import { useOwnerListings } from '@/hooks/useOwnerListings';

const column = createColumnHelper();
export default function OwnerListingsPage() {
  const { data: listings = [], isLoading, error, deleteListing } = useOwnerListings();
  const [deleteError, setDeleteError] = useState('');
  const removeListing = useCallback(id => {
    if (!window.confirm('Delete this listing from your owner account?')) return;
    setDeleteError('');
    try {
      deleteListing(id);
    } catch (cause) {
      setDeleteError(cause.message || 'Unable to delete this listing.');
    }
  }, [deleteListing]);
  const columns = useMemo(() => [
    column.accessor('title', { header: 'Property', cell: info => <div className="table-property"><img src={info.row.original.images?.[0]} alt="" /><span><strong>{info.getValue()}</strong><small>{info.row.original.neighborhood}, {info.row.original.city}</small></span></div> }),
    column.accessor('monthlyRent', { header: 'Monthly rent', cell: info => formatETB(info.getValue()) }),
    column.accessor('status', { header: 'Status', cell: info => <span className={`status-pill ${info.getValue() === 'draft' ? 'draft' : ''}`}>{info.getValue() || 'active'}</span> }),
    column.accessor('createdAt', { header: 'Date added' }),
    column.display({ id: 'actions', header: 'Actions', cell: info => <div className="table-actions"><Link href={`/owner-dashboard/listings/${info.row.original.id}/edit`} aria-label="Edit listing"><Pencil size={16} /></Link><button onClick={() => removeListing(info.row.original.id)} aria-label="Delete listing"><Trash2 size={16} /></button></div> })
  ], [removeListing]);
  const table = useReactTable({ data: listings, columns, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageSize: 8 } } });
  return <><PageTitle eyebrow="Your account inventory" title="My listings" description="Manage properties attached to your signed-in owner account."><Link href="/owner-dashboard/listings/new" className="btn btn-primary"><Plus size={16} /> Add listing</Link></PageTitle><section className="container owner-listings"><Link href="/owner-dashboard" className="back-link"><ArrowLeft size={15} /> Dashboard</Link>{error && <div className="owner-alert" role="alert">{error.message}</div>}{deleteError && <div className="owner-alert" role="alert">{deleteError}</div>}<div className="surface table-wrap"><table className="owner-table"><thead>{table.getHeaderGroups().map(group => <tr key={group.id}>{group.headers.map(header => <th key={header.id}><button onClick={header.column.getToggleSortingHandler()}>{flexRender(header.column.columnDef.header, header.getContext())}{({ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted()] || '')}</button></th>)}</tr>)}</thead><tbody>{isLoading ? <tr><td colSpan={5}><div className="empty-small">Loading your listings…</div></td></tr> : table.getRowModel().rows.length ? table.getRowModel().rows.map(row => <tr key={row.id}>{row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>) : <tr><td colSpan={5}><div className="empty-small"><p>No listings yet. Add a property to get started.</p><Link href="/owner-dashboard/listings/new" className="btn btn-primary">Add listing</Link></div></td></tr>}</tbody></table><div className="table-pagination"><span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} · {listings.length} listings</span><div><button className="btn btn-secondary" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ArrowLeft size={15} /> Previous</button><button className="btn btn-secondary" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next <ArrowRight size={15} /></button></div></div></div></section></>;
}
