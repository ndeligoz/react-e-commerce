import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import ProductList from "./components/ProductList/ProductList";
import Pagination from "./components/Pagination/Pagination";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [isListView, setIsListView] = useState(true);

  console.log(selectedCategories);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        console.log("data", data);

        const starredProducts =
          JSON.parse(localStorage.getItem("starredProducts")) || {};
        const productsWithStars = data.map((product) => ({
          ...product,
          starred: starredProducts[product.id] || false,
        }));

        setProducts(productsWithStars);
        setCategories(
          Array.from(new Set(data.map((product) => product.category)))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (event, category) => {
    setSelectedCategories((prevCategories) => {
      // Eğer seçilen kategori zaten mevcut ise, onu listeden çıkar.
      if (prevCategories.includes(category)) {
        return prevCategories.filter((c) => c !== category);
      } else {
        // Mevcut kategorilere yeni kategoriyi ekle.
        return [...prevCategories, category];
      }
    });
    setCurrentPage(1);
  };

  const handleStarClick = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, starred: !product.starred }
          : product
      )
    );
  };

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  useEffect(() => {
    localStorage.setItem(
      "starredProducts",
      JSON.stringify(
        products.reduce((acc, product) => {
          acc[product.id] = product.starred;
          return acc;
        }, {})
      )
    );
  }, [selectedCategories, products]);

  const filteredProducts =
    selectedCategories.length > 0
      ? products.filter((product) =>
          selectedCategories.includes(product.category)
        )
      : products;

  const searchedProducts = searchTerm
    ? filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredProducts;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = searchedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewChange = (isList) => {
    setIsListView(isList);
  };

  return (
    <div className="layout">
      <div className="categories">
        <CategoryFilter
          categories={categories}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
        />
      </div>
      <div className="sales">
        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                products={currentProducts}
                onStarClick={handleStarClick}
                isListView={isListView}
                handleViewChange={handleViewChange}
              />
            }
          />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
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

export default App;
