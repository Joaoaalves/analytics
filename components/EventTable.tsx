import React, { useState } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ActionDetails from '@/components/ActionDetails';
import type { IEvent } from '@/types/aws';

export const columns: ColumnDef<IEvent>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'EventId',
        header: 'EventId',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('EventId')}</div>
        )
    },
    {
        accessorKey: 'EventType',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    EventType
                    {column.getIsSorted() === 'asc' ? (
                        <IoMdArrowDropup className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <IoMdArrowDropdown className="ml-2 h-4 w-4" />
                    ) : null}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue('EventType')}</div>
        )
    },
    {
        accessorKey: 'Timestamp',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date
                    {column.getIsSorted() === 'asc' ? (
                        <IoMdArrowDropup className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <IoMdArrowDropdown className="ml-2 h-4 w-4" />
                    ) : null}
                </Button>
            );
        },
        cell: ({ row }) => {
            const ts: Date = new Date(row.getValue('Timestamp'));
            const formatted = `${ts.getDate()}/${ts.getMonth() + 1}/${ts.getFullYear()} - ${ts.getHours()}:${ts.getMinutes()}`;
            return <div className="text-left font-medium">{formatted}</div>;
        },
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.getValue(columnId));
            const dateB = new Date(rowB.getValue(columnId));
            return dateA.getTime() - dateB.getTime();
        }
    },
    {
        accessorKey: 'Details',
        header: () => <div className="text-end">Details</div>,
        cell: ({ row }) => {
            const details: Object = row.getValue('Details');
            return <ActionDetails details={details} />;
        }
    }
];

export default function EventTable({ data }: { data: IEvent[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        },
        onPaginationChange: setPagination
    });

    return (
        <>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell, index) => (
                                    <TableCell className={`${index == 4 ? 'flex items-end' : ''}`} key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex w-full items-center p-8 justify-between">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className='disabled:bg-secondary/50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-secondary p-3 min-w-48 hover:scale-105 cursor-pointer transition-all duration-150 rounded-md shadow text-white font-bold'
                >
                    Previous
                </button>
                <span className='font-bold'>
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className='disabled:bg-primary/50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-primary p-3 min-w-48 hover:scale-105 cursor-pointer transition-all duration-150 rounded-md shadow text-white font-bold'
                >
                    Next
                </button>
            </div>
        </>
    );
}