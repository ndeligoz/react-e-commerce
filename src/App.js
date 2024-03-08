// App.js

import React, { useState, useEffect } from "react";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import ProductList from "./components/ProductList/ProductList";
import Empty from "./components/Empty/Empty"; // Yeni eklenen component
import Pagination from "./components/Pagination/Pagination";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

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
    console.log("Seçilen Kategori:", category);

    // Eğer kategori tekrar seçiliyse, kategoriyi kaldır
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );

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
  }, [selectedCategory, products]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
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
    <div>
      <h1>Ürünler</h1>
      <CategoryFilter
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />
      {currentProducts.length === 0 ? (
        <Empty message="Ürün bulunamadı." />
      ) : (
        <ProductList products={currentProducts} onStarClick={handleStarClick} />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(searchedProducts.length / productsPerPage)}
        onPageChange={paginate}
      />
    </div>
  );
};

export default App;
