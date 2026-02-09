"use client";
import React from "react";
import Link from "next/link";

const CategoryCard = ({ category }) => {
  return (
    <Link href={category.href || `/productView?category=${category.name.toLowerCase()}`}>
      <div className="category-card flex flex-col items-center p-4 hover:shadow-card-hover transition-all duration-300">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 flex items-center justify-center">
          {category.icon ? (
            <span className="text-4xl sm:text-5xl">{category.icon}</span>
          ) : (
            <img
              src={category.image || '/placeholder.png'}
              alt={category.name}
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <span className="text-sm font-medium text-gray-800 text-center">{category.name}</span>
        {category.subtitle && (
          <span className="text-xs text-gray-500 text-center mt-0.5">{category.subtitle}</span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
