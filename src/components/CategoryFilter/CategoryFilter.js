import React from "react";
import "./CategoryFilter.scss";
import { FiFilter } from "react-icons/fi";
import "../../style/variables.scss";

const CategoryFilter = ({ categories, onCategoryChange, onSearchChange }) => {
  return (
    <div className="filter">
      <div className="filter-title">
        <FiFilter />
        Filter
      </div>
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="filter-categories-title">Categories:</div>
      {categories.map((category) => (
        <label key={category}>
          <input
            type="checkbox"
            value={category}
            onChange={(e) => onCategoryChange(e, category)}
          />
          {category}
        </label>
      ))}
    </div>
  );
};

export default CategoryFilter;
