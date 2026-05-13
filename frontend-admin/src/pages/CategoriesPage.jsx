import React,
{
  useEffect,
  useState,
} from "react";

import axios from "axios";

import AdminLayout from "../layout/AdminLayout";

const CategoriesPage = () => {

  const [products,
    setProducts] =
    useState([]);

  // FETCH PRODUCTS

  const fetchProducts =
    async () => {

      try {

        const { data } =
          await axios.get(
            "https://grocery-store-project-l9y7.onrender.com/api/products"
          );

        setProducts(data);

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchProducts();

  }, []);

  // UNIQUE CATEGORIES

  const categories =
    [
      ...new Set(
        products.map(
          (item) =>
            item.category
        )
      ),
    ];

  return (

    <AdminLayout>

      <h1 className="text-5xl font-bold mb-10">

        Categories

      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {
          categories.map(
            (category, index) => (

              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-xl"
              >

                <h2 className="text-3xl font-bold text-green-600">

                  {category}

                </h2>

                <p className="text-gray-500 mt-4">

                  Products Available

                </p>

              </div>
            )
          )
        }

      </div>

    </AdminLayout>
  );
};

export default CategoriesPage;