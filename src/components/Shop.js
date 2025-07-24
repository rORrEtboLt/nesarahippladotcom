import React from 'react';
import ProductCard from './ProductCard';

function Shop() {
  const products = [
    {
      name: "Moonlit Lotus - Physical",
      desc: "Mixed media on canvas, 12x16in",
      price: "₹6,999",
      type: "physical",
      img: "/products/moonlit-lotus.jpg",
      payu: "https://payu.in/payment-link1"
    },
    {
      name: "Digital Print - Dream Horizons",
      desc: "High-res digital download (personal use)",
      price: "₹799",
      type: "digital",
      img: "/products/dream-horizons.jpg",
      payu: "https://payu.in/payment-link2"
    }
  ];

  return (
    <section className="shop">
      <h2>Shop Artworks</h2>
      <div className="products-grid">
        {products.map((item, idx) => (
          <ProductCard key={idx} product={item} />
        ))}
      </div>
    </section>
  );
}

export default Shop;
