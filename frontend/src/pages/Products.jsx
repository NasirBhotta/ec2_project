import React from "react";
import ProductCard from "../components/ProductCard";
import appleImage from "../assets/apple.png";
import bananaImage from "../assets/cherry.png";
import cherryImage from "../assets/banana.png";

const dummyProducts = [
  {
    id: 1,
    name: "Apple",
    price: 1,
    description: "Fresh and juicy apples, perfect for snacking or baking.",
    image: appleImage,
  },
  {
    id: 2,
    name: "Banana",
    price: 2,
    description: "Sweet and healthy bananas, a great source of potassium.",
    image: bananaImage,
  },
  {
    id: 3,
    name: "Cherry",
    price: 3,
    description: "Deliciously sweet cherries, perfect for desserts or eating fresh.",
    image: cherryImage,
  },
];

function Products() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Our Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
