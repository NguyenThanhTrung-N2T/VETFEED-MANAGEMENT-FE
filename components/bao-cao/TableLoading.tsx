interface TableBodyLoadingProps {
    rows?: number;          // number of skeleton rows
    columns: number;        // number of columns in your table
}

export const TableBodyLoading: React.FC<TableBodyLoadingProps> = ({ rows = 5, columns }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <td key={colIdx} className={`px-6 py-4 ${colIdx >= columns - 2 ? "text-right" : "text-left"}`}>
                            <div className={`h-4 bg-gray-200 rounded w-full ${colIdx % 2 === 0 ? "w-24" : "w-32"}`} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

export default TableBodyLoading;