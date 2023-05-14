import React from "react";
import "./Pagination.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export const Pagination = ({ total, setCurrentPage, currentPage }) => {
  const pages = [];
  let n = Math.ceil(total / 8);
  for (let i = 1; i <= n; i++) {
    pages.push(i);
  }
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < n) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="pagination-container">
      <button onClick={handlePrevious}>
        <KeyboardArrowLeftIcon />
      </button>
      {pages.map((page, index) => {
        return (
          <button key={index} onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        );
      })}
      <button onClick={handleNext}>
        <KeyboardArrowRightIcon />
      </button>
    </div>
  );
};
