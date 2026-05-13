import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import AdminLayout from "../layout/AdminLayout";

import {
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const ProductsPage = () => {

  const [showModal, setShowModal] =
    useState(false);

  const [products, setProducts] =
    useState([]);

  const [isEdit, setIsEdit] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      price: "",
      stock: "",
      category: "",
      image: "",
    });

  // FETCH PRODUCTS

  const fetchProducts = async () => {

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

  // CHANGE HANDLER

  const changeHandler = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD PRODUCT

  const addProductHandler = async () => {

    try {

      await axios.post(
        "https://grocery-store-project-l9y7.onrender.com/api/products",
        formData
      );

      fetchProducts();

      closeModal();

    } catch (error) {

      console.log(error);
    }
  };

  // DELETE PRODUCT

  const deleteHandler = async (id) => {

    try {

      await axios.delete(
        `https://grocery-store-project-l9y7.onrender.com/api/products/${id}`
      );

      fetchProducts();

    } catch (error) {

      console.log(error);
    }
  };

  // EDIT PRODUCT

  const editHandler = (product) => {

    setIsEdit(true);

    setEditId(product._id);

    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image,
    });

    setShowModal(true);
  };

  // UPDATE PRODUCT

  const updateProductHandler =
    async () => {

      try {

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/products/${editId}`,
          formData
        );

        fetchProducts();

        closeModal();

      } catch (error) {

        console.log(error);
      }
    };

  // CLOSE MODAL

  const closeModal = () => {

    setShowModal(false);

    setIsEdit(false);

    setEditId(null);

    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      image: "",
    });
  };

  return (
    <AdminLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-5xl font-bold">
          Products
        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg"
        >

          <FaPlus />

          Add Product

        </button>

      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {
          products.map((product) => (

            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >

              <img
                src={product.image}
                alt=""
                className="w-full h-56 object-cover"
              />

              <div className="p-5">

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {product.name}
                    </h2>

                    <p className="text-gray-500">
                      {product.category}
                    </p>

                  </div>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-sm">

                    {product.stock} Stock

                  </span>

                </div>

                <div className="flex justify-between items-center mt-5">

                  <h3 className="text-3xl font-bold text-green-600">

                    ₹{product.price}

                  </h3>

                  <div className="flex gap-4">

                    <button
                      onClick={() =>
                        editHandler(product)
                      }
                      className="text-blue-600 text-2xl"
                    >

                      <FaEdit />

                    </button>

                    <button
                      onClick={() =>
                        deleteHandler(
                          product._id
                        )
                      }
                      className="text-red-600 text-2xl"
                    >

                      <FaTrash />

                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))
        }

      </div>

      {/* MODAL */}

      {
        showModal && (

          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-4xl font-bold">

                  {
                    isEdit
                      ? "Edit Product"
                      : "Add Product"
                  }

                </h2>

                <button
                  onClick={closeModal}
                  className="text-3xl"
                >
                  ✕
                </button>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Price"
                  name="price"
                  value={formData.price}
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  name="stock"
                  value={formData.stock}
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                >

                  <option value="">
                    Select Category
                  </option>

                  <option>
                    Dairy
                  </option>

                  <option>
                    Fruits
                  </option>

                  <option>
                    Vegetables
                  </option>

                  <option>
                    Bakery
                  </option>

                  <option>
                    Snacks
                  </option>

                </select>

              </div>

              <input
                type="text"
                placeholder="Image URL"
                name="image"
                value={formData.image}
                onChange={changeHandler}
                className="border p-4 rounded-2xl w-full mt-5"
              />

              {
                formData.image && (

                  <img
                    src={formData.image}
                    alt=""
                    className="w-40 h-40 object-cover rounded-2xl mt-5"
                  />
                )
              }

              <button
                onClick={
                  isEdit
                    ? updateProductHandler
                    : addProductHandler
                }
                className="bg-green-600 hover:bg-green-700 text-white w-full py-4 rounded-2xl mt-6 text-xl font-bold"
              >

                {
                  isEdit
                    ? "Update Product"
                    : "Add Product"
                }

              </button>

            </div>

          </div>
        )
      }

    </AdminLayout>
  );
};

export default ProductsPage;