import { useNavigate }
  from "react-router-dom";

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
  FaSearch,
  FaShoppingCart,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";

import { motion }
  from "framer-motion";

const categories = [
  "All",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Snacks",
];

const HomePage = () => {

  const navigate =
    useNavigate();

  const [products,
    setProducts] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [cart,
    setCart] =
    useState(

      JSON.parse(
        localStorage.getItem(
          "cart"
        )
      ) || []

    );

  const [showCart,
    setShowCart] =
    useState(false);

  const [
    showCheckout,
    setShowCheckout,
  ] = useState(false);

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("ONLINE");

  const [
    customerData,
    setCustomerData,
  ] = useState({

    customerName: "",

    customerPhone: "",

    address: "",
  });

  // FETCH PRODUCTS

  const fetchProducts =
    useCallback(async () => {

      try {

        const { data } =
          await axios.get(
            "https://grocery-store-project-l9y7.onrender.com/api/products"
          );

        setProducts(data);

      } catch (error) {

        console.log(error);
      }

    }, []);

  useEffect(() => {



    fetchProducts();

  // eslint-disable-next-line
}, []);

  // SAVE CART

  useEffect(() => {

    localStorage.setItem(

      "cart",

      JSON.stringify(cart)

    );

  }, [cart]);

  // ADD TO CART

  const addToCart =
    (product) => {

      if (
        product.stock === 0
      ) {

        return;
      }

      const existing =
        cart.find(
          (item) =>
            item._id ===
            product._id
        );

      if (existing) {

        if (
          existing.quantity >=
          product.stock
        ) {

          alert(
            "Maximum stock reached"
          );

          return;
        }

        updateQuantity(
          product._id,
          "increase"
        );

      } else {

        setCart([
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ]);
      }
    };

  // UPDATE QUANTITY

  const updateQuantity =
    (id, type) => {

      let updatedCart =
        cart.map((item) => {

          if (
            item._id === id
          ) {

            if (
              type ===
              "increase"
            ) {

              if (
                item.quantity >=
                item.stock
              ) {

                return item;
              }

              return {

                ...item,

                quantity:
                  item.quantity +
                  1,
              };
            }

            if (
              type ===
              "decrease"
            ) {

              return {

                ...item,

                quantity:
                  item.quantity -
                  1,
              };
            }

            if (
              type ===
              "remove"
            ) {

              return {

                ...item,

                quantity: 0,
              };
            }
          }

          return item;
        });

      updatedCart =
        updatedCart.filter(
          (item) =>
            item.quantity > 0
        );

      setCart(updatedCart);
    };

  // SUBTOTAL

const subTotal =
  cart.reduce(
    (
      total,
      item
    ) =>
      total +
      item.price *
      item.quantity,
    0
  );

// GST 5%

const gstAmount =
  Math.round(
    subTotal * 0.05
  );

// DELIVERY CHARGE

const deliveryCharge =
  subTotal >= 100
    ? 0
    : 25;

// PLATFORM FEE

const platformFee =
  subTotal > 0
    ? 5
    : 0;

// FINAL TOTAL

const totalAmount =
  subTotal +
  gstAmount +
  deliveryCharge +
  platformFee;

// FREE DELIVERY PROGRESS

const freeDeliveryLeft =
  100 - subTotal;

const progressWidth =
  Math.min(
    (subTotal / 100) * 100,
    100
  );

  // FIND CART ITEM

  const getCartItem =
    (id) => {

      return cart.find(
        (item) =>
          item._id === id
      );
    };

  // INPUT CHANGE

  const changeHandler =
    (e) => {

      setCustomerData({

        ...customerData,

        [e.target.name]:
          e.target.value,
      });
    };

  // CREATE ORDER

  const createOrderAfterPayment =
    async () => {

const user =
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

const orderData = {

  customerId:
    user?._id,

  ...customerData,

  products:
    cart.map(
      (item) => ({

        name:
          item.name,

        quantity:
          item.quantity,

        price:
          item.price,
      })
    ),

  totalAmount,

  paymentMethod,

  gstAmount,

  deliveryCharge,

  platformFee,

  cashReceived:
    false,

  adminCashReceived:
    false,

  cashCollectedAmount:
    0,

  orderStatus:
    "PLACED",
};

      const response =
        await axios.post(
          "https://grocery-store-project-l9y7.onrender.com/api/orders",
          orderData
        );

      alert(
        "Order Placed Successfully"
      );

      localStorage.setItem(
        "currentOrderId",
        response.data._id
      );

      setCart([]);

      localStorage.removeItem(
        "cart"
      );

      setShowCheckout(false);

      setShowCart(false);

      navigate("/tracking");

      fetchProducts();
    };

  // PLACE ORDER

  const placeOrder =
    async () => {

      if (
        !customerData.customerName ||

        !customerData.customerPhone ||

        !customerData.address
      ) {

        alert(
          "Please fill all details"
        );

        return;
      }

      if (
        cart.length === 0
      ) {

        alert(
          "Cart is empty"
        );

        return;
      }

      try {

        setLoading(true);

        // COD

        if (
          paymentMethod ===
          "COD"
        ) {

          await createOrderAfterPayment();

          return;
        }

        // CREATE PAYMENT ORDER

        const { data } =
          await axios.post(
            "https://grocery-store-project-l9y7.onrender.com/api/payment/create-order",
            {
              amount:
                totalAmount,
            }
          );

        const options = {

          key:
            "rzp_test_SnxTvEjDW6ZUdg",

          amount:
            data.amount,

          currency:
            data.currency,

          name:
            "Blinkit Clone",

          description:
            "Order Payment",

          order_id:
            data.id,

          handler:
            async function (
              response
            ) {

              const verify =
                await axios.post(
                  "https://grocery-store-project-l9y7.onrender.com/api/payment/verify",
                  response
                );

              if (
                verify.data
                  .success
              ) {

                await createOrderAfterPayment();

              } else {

                alert(
                  "Payment Failed"
                );
              }
            },

          prefill: {

            name:
              customerData.customerName,

            contact:
              customerData.customerPhone,
          },

          theme: {
            color:
              "#16a34a",
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // FILTER PRODUCTS

  const filteredProducts =
    products.filter(
      (item) => {

        const matchesSearch =
          item.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =

          selectedCategory ===
          "All" ||

          item.category ===
          selectedCategory;

        return (

          matchesSearch &&
          matchesCategory
        );
      }
    );

  return (

    <div className="bg-gray-100 min-h-screen">

      {/* NAVBAR */}

      <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">

        {/* LOGO */}

        <h1 className="text-4xl font-bold cursor-pointer">

          Grocery Store

        </h1>

        {/* SEARCH */}

        <div className="hidden md:flex bg-white rounded-2xl px-4 py-3 w-[40%] items-center">

          <FaSearch className="text-gray-500 mr-3" />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full outline-none text-black"
          />

        </div>

        {/* RIGHT SECTION */}

        <div className="flex items-center gap-6">

          {/* CART */}

          <div
            className="relative cursor-pointer hover:text-yellow-300 transition"
            onClick={() =>
              setShowCart(true)
            }
          >

            <FaShoppingCart className="text-4xl" />

            {
              cart.length > 0 && (

                <span className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full flex justify-center items-center text-sm font-bold">

                  {cart.length}

                </span>
              )
            }

          </div>

          {/* PROFILE */}

          {/* PROFILE */}

          <div className="relative">

            <button
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              className="hover:text-yellow-300 transition"
            >

              {
                JSON.parse(
                  localStorage.getItem(
                    "user"
                  )
                )?.avatar ? (

                  <img
                    src={
                      JSON.parse(
                        localStorage.getItem(
                          "user"
                        )
                      )?.avatar
                    }
                    alt=""
                    className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  />

                ) : (

                  <FaUserCircle className="text-5xl" />

                )
              }

            </button>

            {/* PROFILE DROPDOWN */}

            {
  showProfileMenu && (

    <div className="absolute right-0 mt-4 w-60 bg-white text-black rounded-2xl shadow-2xl overflow-hidden z-50">

      {/* LOGIN */}

      {
        !localStorage.getItem(
          "token"
        ) && (

          <button
            onClick={() => {

              setShowProfileMenu(false);

              localStorage.setItem(
                "redirectAfterLogin",
                "/"
              );

              navigate("/login");
            }}
            className="w-full text-left px-5 py-4 hover:bg-green-100 text-green-600 font-bold"
          >

            Login

          </button>
        )
      }

      {/* PROFILE */}

      <button
        onClick={() => {

          const token =
            localStorage.getItem(
              "token"
            );

          setShowProfileMenu(false);

          if (!token) {

            localStorage.setItem(
              "redirectAfterLogin",
              "/profile"
            );

            navigate("/login");

            return;
          }

          navigate("/profile");

        }}
        className="w-full text-left px-5 py-4 hover:bg-gray-100 font-semibold"
      >

        My Profile

      </button>

      {/* ORDERS */}

      <button
        onClick={() => {

          const token =
            localStorage.getItem(
              "token"
            );

          setShowProfileMenu(false);

          if (!token) {

            localStorage.setItem(
              "redirectAfterLogin",
              "/orders"
            );

            navigate("/login");

            return;
          }

          navigate("/orders");

        }}
        className="w-full text-left px-5 py-4 hover:bg-gray-100 font-semibold"
      >

        My Orders

      </button>

      {/* ADDRESSES */}

      <button
        onClick={() => {

          const token =
            localStorage.getItem(
              "token"
            );

          setShowProfileMenu(false);

          if (!token) {

            localStorage.setItem(
              "redirectAfterLogin",
              "/addresses"
            );

            navigate("/login");

            return;
          }

          navigate("/addresses");

        }}
        className="w-full text-left px-5 py-4 hover:bg-gray-100 font-semibold"
      >

        Saved Addresses

      </button>

      {/* LOGOUT */}

      {
        localStorage.getItem(
          "token"
        ) && (

          <button
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              setShowProfileMenu(false);

              navigate("/");

              window.location.reload();

            }}
            className="w-full text-left px-5 py-4 hover:bg-red-100 text-red-600 font-semibold"
          >

            Logout

          </button>
        )
      }

    </div>
  )
}

          </div>

        </div>

      </div>

      {/* HERO */}

      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-10 rounded-b-[50px] shadow-lg">

        <h1 className="text-5xl font-bold">

          Delivering groceries
          in 10 minutes ⚡

        </h1>

        <p className="mt-4 text-xl">

          Fresh groceries at your doorstep

        </p>

      </div>

      {/* CATEGORY */}

      <div className="px-6 mt-8">

        <div className="flex gap-4 overflow-x-auto pb-4">

          {
            categories.map(
              (cat) => (

                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(cat)
                  }
                  className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition ${selectedCategory ===
                    cat
                    ? "bg-green-600 text-white"
                    : "bg-white"
                    }`}
                >

                  {cat}

                </button>
              )
            )
          }

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="px-6 mt-8">

        <h2 className="text-4xl font-bold mb-8">

          Best Sellers

        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">

          {
            filteredProducts.map(
              (product) => {

                const cartItem =
                  getCartItem(
                    product._id
                  );

                return (

                  <motion.div
                    whileHover={{
                      y: -5,
                    }}
                    key={product._id}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden"
                  >

                    <img
                      src={product.image}
                      alt=""
                      className="w-full h-52 object-cover"
                    />

                    <div className="p-5">

                      <p className="text-gray-500 text-sm">

                        {product.category}

                      </p>

                      <p className="text-sm mt-1">

                        {
                          product.stock > 0 ? (

                            <span className="text-green-600 font-bold">

                              {product.stock} in stock

                            </span>

                          ) : (

                            <span className="text-red-600 font-bold">

                              Out Of Stock

                            </span>
                          )
                        }

                      </p>

                      <h2 className="text-2xl font-bold mt-2">

                        {product.name}

                      </h2>

                      <div className="flex justify-between items-center mt-5">

                        <h3 className="text-3xl font-bold text-green-600">

                          ₹{product.price}

                        </h3>

                        {
                          cartItem ? (

                            <div className="flex items-center gap-3 bg-green-600 text-white px-3 py-2 rounded-xl">

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    product._id,
                                    "decrease"
                                  )
                                }
                              >

                                -

                              </button>

                              <span>

                                {
                                  cartItem.quantity
                                }

                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    product._id,
                                    "increase"
                                  )
                                }
                              >

                                +

                              </button>

                            </div>

                          ) : (

                            <button
                              disabled={
                                product.stock === 0
                              }
                              onClick={() =>
                                addToCart(product)
                              }
                              className={`px-5 py-2 rounded-xl text-white ${product.stock === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                            >

                              {
                                product.stock === 0
                                  ? "Out"
                                  : "Add"
                              }

                            </button>
                          )
                        }

                      </div>

                    </div>

                  </motion.div>
                );
              }
            )
          }

        </div>

      </div>

      {/* OVERLAY */}

      {
        showCart && (

          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() =>
              setShowCart(false)
            }
          ></div>
        )
      }

      {/* CART SIDEBAR */}

      <div
        className={`fixed top-0 right-0 h-screen w-full md:w-[450px] bg-white z-50 shadow-2xl transition-transform duration-300 ${showCart
          ? "translate-x-0"
          : "translate-x-full"
          }`}
      >

        <div className="p-6 flex flex-col h-full">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-4xl font-bold">

              Cart

            </h2>

            <button
              onClick={() =>
                setShowCart(false)
              }
              className="text-4xl"
            >

              ✕

            </button>

          </div>

          {/* ITEMS */}

          <div className="flex-1 overflow-y-auto space-y-5">

            {
              cart.length === 0 ? (

                <div className="text-center mt-20 text-gray-500 text-xl">

                  Cart is Empty

                </div>

              ) : (

                cart.map((item) => (

                  <div
                    key={item._id}
                    className="flex gap-4 border-b pb-5"
                  >

                    <img
                      src={item.image}
                      alt=""
                      className="w-24 h-24 object-cover rounded-2xl"
                    />

                    <div className="flex-1">

                      <h3 className="text-xl font-bold">

                        {item.name}

                      </h3>

                      <p className="text-green-600 text-xl font-bold mt-2">

                        ₹{item.price}

                      </p>

                      <div className="flex items-center gap-3 mt-3">

                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              "decrease"
                            )
                          }
                          className="bg-gray-200 px-3 py-1 rounded-lg"
                        >

                          -

                        </button>

                        <span className="font-bold">

                          {item.quantity}

                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              "increase"
                            )
                          }
                          className="bg-gray-200 px-3 py-1 rounded-lg"
                        >

                          +

                        </button>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          "remove"
                        )
                      }
                      className="text-red-600 text-2xl"
                    >

                      <FaTrash />

                    </button>

                  </div>
                ))
              )
            }

          </div>

          {/* BILL DETAILS */}

<div className="border-t pt-5">

  {/* FREE DELIVERY BAR */}

  {
    subTotal < 100 ? (

      <div className="mb-5">

        <div className="flex justify-between mb-2">

          <span className="font-semibold text-sm">

            Add ₹
            {freeDeliveryLeft}
            {" "}
            more for FREE delivery 🚀

          </span>

          <span className="text-sm font-bold text-green-600">

            {Math.round(progressWidth)}%

          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{
              width:
                `${progressWidth}%`,
            }}
          ></div>

        </div>

      </div>

    ) : (

      <div className="bg-green-100 text-green-700 p-4 rounded-2xl font-bold text-center mb-5">

        🎉 You unlocked FREE Delivery

      </div>

    )
  }

  {/* BILL DETAILS */}

  <div className="space-y-3">

    <div className="flex justify-between text-lg">

      <span>Subtotal</span>

      <span>
        ₹{subTotal}
      </span>

    </div>

    <div className="flex justify-between text-lg">

      <span>GST (5%)</span>

      <span>
        ₹{gstAmount}
      </span>

    </div>

    <div className="flex justify-between text-lg">

      <span>Platform Fee</span>

      <span>
        ₹{platformFee}
      </span>

    </div>

    <div className="flex justify-between text-lg">

      <span>Delivery Charge</span>

      <span className={
        deliveryCharge === 0
          ? "text-green-600 font-bold"
          : ""
      }>

        {
          deliveryCharge === 0
            ? "FREE"
            : `₹${deliveryCharge}`
        }

      </span>

    </div>

  </div>

  {/* FINAL TOTAL */}

  <div className="flex justify-between text-3xl font-bold mt-6 border-t pt-5">

    <span>Total</span>

    <span className="text-green-600">

      ₹{totalAmount}

    </span>

  </div>

            <button
              onClick={() => {

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {

    localStorage.setItem(
      "redirectAfterLogin",
      "/"
    );

    alert(
      "Please login to continue"
    );

    navigate("/login");

    return;
  }

  setShowCheckout(true);
}}
              disabled={
                cart.length === 0
              }
              className={`w-full py-4 rounded-2xl mt-6 text-xl font-bold text-white ${cart.length === 0
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >

              Proceed to Checkout

            </button>

          </div>

        </div>

      </div>

      {/* CHECKOUT */}

      {
        showCheckout && (

          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] p-4">

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8 max-h-[95vh] overflow-y-auto scrollbar-hide">

              {/* HEADER */}

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-4xl font-bold">

                  Checkout

                </h2>

                <button
                  onClick={() =>
                    setShowCheckout(false)
                  }
                  className="text-4xl"
                >

                  ✕

                </button>

              </div>

              {/* FORM */}

              <div className="space-y-5">

                <input
                  type="text"
                  placeholder="Customer Name"
                  name="customerName"
                  value={
                    customerData.customerName
                  }
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl w-full"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  name="customerPhone"
                  value={
                    customerData.customerPhone
                  }
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl w-full"
                />

                <textarea
                  rows="4"
                  placeholder="Delivery Address"
                  name="address"
                  value={
                    customerData.address
                  }
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl w-full"
                ></textarea>

              </div>

              {/* PAYMENT METHOD */}

              <div className="mt-6">

                <h3 className="text-xl font-bold mb-4">

                  Select Payment Method

                </h3>

                <div className="flex gap-4">

                  <button
                    onClick={() =>
                      setPaymentMethod(
                        "ONLINE"
                      )
                    }
                    className={`px-6 py-3 rounded-2xl font-bold ${paymentMethod ===
                      "ONLINE"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                      }`}
                  >

                    Online Payment

                  </button>

                  <button
                    onClick={() =>
                      setPaymentMethod(
                        "COD"
                      )
                    }
                    className={`px-6 py-3 rounded-2xl font-bold ${paymentMethod ===
                      "COD"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                      }`}
                  >

                    Cash On Delivery

                  </button>

                </div>

              </div>

              {/* BILL SUMMARY */}

<div className="bg-gray-100 rounded-2xl p-5 mt-6">

  <h3 className="text-2xl font-bold mb-5">

    Bill Summary

  </h3>

  <div className="space-y-3">

    <div className="flex justify-between">

      <span>Subtotal</span>

      <span>
        ₹{subTotal}
      </span>

    </div>

    <div className="flex justify-between">

      <span>GST (5%)</span>

      <span>
        ₹{gstAmount}
      </span>

    </div>

    <div className="flex justify-between">

      <span>Platform Fee</span>

      <span>
        ₹{platformFee}
      </span>

    </div>

    <div className="flex justify-between">

      <span>Delivery Charge</span>

      <span className={
        deliveryCharge === 0
          ? "text-green-600 font-bold"
          : ""
      }>

        {
          deliveryCharge === 0
            ? "FREE"
            : `₹${deliveryCharge}`
        }

      </span>

    </div>

    <div className="border-t pt-4 flex justify-between text-2xl font-bold">

      <span>Total Amount</span>

      <span className="text-green-600">

        ₹{totalAmount}

      </span>

    </div>

  </div>

</div>

              {/* PLACE ORDER */}

              <button
                onClick={placeOrder}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white w-full py-4 rounded-2xl mt-8 text-xl font-bold"
              >

                {
                  loading
                    ? "Processing..."
                    : paymentMethod ===
                      "ONLINE"
                      ? "Pay Now"
                      : "Place Order"
                }

              </button>

            </div>

          </div>
        )
      }


    </div>
  );
};

export default HomePage;