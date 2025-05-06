import React from "react";
import { useCartStore } from "../store/cartStore";

function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full transform hover:scale-105">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-xl mb-4"
      />
      <div>
        <h3 className="text-2xl font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">${product.price.toFixed(2)}</p>
        <p className="text-gray-600 text-sm pb-2">{product.description}</p>
      </div>
      <button
        onClick={() => addToCart(product)}
        className="mt-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
