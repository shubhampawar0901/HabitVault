import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../hooks/useThemeContext";

interface ActivityPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const ActivityPagination: React.FC<ActivityPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const { isDarkMode } = useTheme();
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Items per page options
  const itemsPerPageOptions = [10, 20, 50];

  // Calculate range of items being displayed
  const startItem = Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1);
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 mt-6 text-sm">
      {/* Items per page selector */}
      <div className="flex items-center space-x-2">
        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Show</span>
        <select
          className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-700'} border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>per page</span>
      </div>

      {/* Pagination info */}
      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        Showing {startItem} to {endItem} of {totalItems} activities
      </div>

      {/* Page navigation */}
      <div className="flex items-center space-x-1">
        {/* Previous page button */}
        <button
          className={`p-1 rounded-md flex items-center justify-center ${
            currentPage === 1
              ? isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
              : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              page === currentPage
                ? isDarkMode ? 'bg-blue-900/30 text-blue-400 font-medium' : 'bg-blue-100 text-blue-600 font-medium'
                : page === '...'
                ? isDarkMode ? 'text-gray-400 cursor-default' : 'text-gray-500 cursor-default'
                : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          className={`p-1 rounded-md flex items-center justify-center ${
            currentPage === totalPages
              ? isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
              : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ActivityPagination;
