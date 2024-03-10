import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import ProductDetail from "./components/ProductDetail/ProductDetail"; // ProductDetail ekledik
import "./App.scss";

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [isListView, setIsListView] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();

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
      const updatedCategories = prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category];

      setCurrentPage(1);
      return updatedCategories;
    });
  };

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleViewChange = (isList) => {
    setIsListView(isList);
  };

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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            isListView={isListView}
            currentProducts={currentProducts}
            handleViewChange={handleViewChange}
            currentPage={currentPage}
            productsPerPage={productsPerPage}
            paginate={paginate}
            searchedProducts={searchedProducts}
          />
        }
      />
      <Route path="/product/:productId" element={<ProductDetail />} />
    </Routes>
  );
};

export default App;
