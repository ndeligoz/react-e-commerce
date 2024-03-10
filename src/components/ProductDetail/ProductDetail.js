import React, { useState, useEffect } from "react";
import "./ProductDetail.scss";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        console.log("data", data);

        const starredProducts =
          JSON.parse(localStorage.getItem("starredProducts")) || {};
        const productWithStars = {
          ...data,
          starred: starredProducts[data.id] || false,
        };

        setProduct(productWithStars);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!product) {
    return <div className="product-detail-card__loading">Loading...</div>;
  }

  const renderStars = (rate, count) => {
    const stars = [];

    // Round to the nearest half
    const roundedRate = Math.round(rate * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRate) {
        stars.push(
          <span className="product-detail-card__stars-full" key={i}>
            &#9733;
          </span>
        ); // Full star
      } else {
        stars.push(
          <span className="product-detail-card__stars-empty" key={i}>
            &#9734;
          </span>
        ); // Empty star
      }
    }

    return (
      <div className="product-detail-card__stars">
        <div>{stars}</div>
        <div className="product-detail-card__stars-count">
          ({count} reviews)
        </div>
      </div>
    );
  };

  return (
    <div className="product-detail">
      <div className="product-detail-card">
        <div className="product-detail-card__title">{product?.title}</div>
        <img
          className="product-detail-card__image"
          src={product.image}
          alt={product.title}
        />
        <div className="product-detail-card__desc">{product?.description}</div>
        <div className="product-detail-card__price">${product?.price}</div>
        {product?.rating &&
          renderStars(product.rating.rate, product.rating.count)}
      </div>
    </div>
  );
};

export default ProductDetail;
