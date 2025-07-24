import React from 'react';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.img} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.desc}</p>
      <p className="price">{product.price}</p>
      <a href={product.payu} className="btn" target="_blank" rel="noopener noreferrer">
        Buy Now
      </a>
    </div>
  );
}

export default ProductCard;
