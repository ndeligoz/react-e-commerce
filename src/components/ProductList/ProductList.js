// ProductList.js

import React, { useState } from "react";
import "./ProductList.css";
import { Link } from "react-router-dom";
import Empty from "../Empty/Empty";
import { FiList, FiGrid, FiShoppingBag } from "react-icons/fi";

const ProductList = ({ products, onStarClick }) => {
  const [isListView, setIsListView] = useState(true);

  const handleListViewClick = () => {
    setIsListView(true);
  };

  const handleTableViewClick = () => {
    setIsListView(false);
  };

  // Check if products array is empty
  if (products.length === 0) {
    return (
      <div className="outside-sales">
        <div className="empty">
          <Empty message="Ürün bulunamadı." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div>
          <FiShoppingBag /> Ürünler
        </div>
        <div className="view-buttons">
          <button
            onClick={handleListViewClick}
            className={isListView ? "active" : ""}
          >
            <FiList />
          </button>
          <button
            onClick={handleTableViewClick}
            className={!isListView ? "active" : ""}
          >
            <FiGrid />
          </button>
        </div>
      </div>

      <div className={`product-grid ${isListView ? "list" : ""}`}>
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="product-link"
          >
            <div className="product" key={product.id}>
              <div>
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-title">{product.title}</div>
              <div className="product-price">{product.price}$</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
