/* eslint-disable jsx-a11y/anchor-is-valid */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import React from "react";

export default function Example({ questions, currentPage, totalPages, onPageChange }) {
  const questionsPerPage = 10;
  const startItem = (currentPage - 1) * questionsPerPage + 1;
  const endItem = Math.min(currentPage * questionsPerPage, questions.length);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{questions.length}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
          >
            <a
              href="#"
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            >
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </a>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and pages around current
                return page === 1 || 
                       page === totalPages || 
                       (page >= currentPage - 1 && page <= currentPage + 1);
              })
              .map((page, index, array) => {
                // Add ellipsis where there are gaps
                const showEllipsisBefore = index > 0 && page > array[index - 1] + 1;
                const showEllipsisAfter = index < array.length - 1 && page < array[index + 1] - 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsisBefore && (
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
                                  ${currentPage === page 
                                      ? "bg-blue-600 text-white"
                                      : "text-gray-900 hover:bg-gray-50"
                                  }
                              `}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <a
              href="#"
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            >
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
