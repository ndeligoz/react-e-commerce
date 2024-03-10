// src/components/Home.js
import React from "react";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import ProductList from "../ProductList/ProductList";
import Pagination from "../Pagination/Pagination";

const Home = ({
  categories,
  handleCategoryChange,
  handleSearchChange,
  isListView,
  currentProducts,
  handleViewChange,
  currentPage,
  productsPerPage,
  paginate,
  searchedProducts,
}) => {
  return (
    <div className="home">
      <div className="home-categories">
        <CategoryFilter
          categories={categories}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
        />
      </div>
      <div className="home-sales">
        <ProductList
          products={currentProducts}
          isListView={isListView}
          handleViewChange={handleViewChange}
        />
        <div className="pagination">
          {currentProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(searchedProducts.length / productsPerPage)}
              onPageChange={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
