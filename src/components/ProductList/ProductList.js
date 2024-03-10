import React, { useState } from "react";
import "./ProductList.scss";
import { Link } from "react-router-dom";
import Empty from "../Empty/Empty";
import { FiList, FiGrid, FiShoppingBag } from "react-icons/fi";

const ProductList = ({ products }) => {
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
      <div className="home-outside-sales">
        <div className="empty">
          <Empty message="Product Not Found." />
        </div>
      </div>
    );
  }

  return (
    <div className="product">
      <div className="product-header">
        <div className="product-header-title">
          <FiShoppingBag /> Products
        </div>
        <div className="product-header-title__actions">
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

      <div className={`product-body ${isListView ? "list" : ""}`}>
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="product-body-content"
          >
            <div className="product-body-content-item" key={product.id}>
              <img
                className="product-body-content-item__image"
                src={product.image}
                alt={product.title}
              />

              <div className="product-body-content-item__title">
                {product.title}
              </div>
              <div className="product-body-content-item__price">
                ${product.price}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
