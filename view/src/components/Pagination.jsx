import React from "react";
import "./componentsStyle/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to generate page numbers based on current page and total pages
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="pagination:container justify-content-center">
      {/* Previous Button */}
      <div
        className={`pagination:number arrow ${currentPage === 1 && "disabled"}`}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
      >
        <svg width="18" height="18">
          <use xlinkHref="#left" />
        </svg>
        <span className="arrow:text">Previous</span>
      </div>

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <div
          key={page}
          className={`pagination:number ${
            page === currentPage ? "pagination:active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </div>
      ))}

      {/* Next Button */}
      <div
        className={`pagination:number arrow ${
          currentPage === totalPages && "disabled"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        <svg width="18" height="18">
          <use xlinkHref="#right" />
        </svg>
      </div>

      {/* SVG symbols */}
      <svg className="hide">
        <symbol
          id="left"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </symbol>
        <symbol
          id="right"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </symbol>
      </svg>
    </div>
  );
};

export default Pagination;
