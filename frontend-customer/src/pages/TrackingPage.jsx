import React,
{
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

import { io }
from "socket.io-client";

// SOCKET

const socket =
  io("http://localhost:5000");

// MAP STYLE

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const TrackingPage = () => {

  const [location,
    setLocation] =
    useState(null);

  const [orderStatus,
    setOrderStatus] =
    useState("");

  // GOOGLE MAPS

  const { isLoaded } =
    useLoadScript({

      googleMapsApiKey:
        "AIzaSyD4VhNBl8Ccgq79dU68hyXYzVrTPz3utk4",
    });

  // ORDER ID

  const orderId =
    localStorage.getItem(
      "currentOrderId"
    );

  // FETCH LOCATION

  const fetchLocation =
    useCallback(
      async () => {

        if (!orderId) {

          return;
        }

        try {

          // LOCATION

          const locationResponse =
            await axios.get(
              `http://localhost:5000/api/location/${orderId}`
            );

          // ORDERS

          const orderResponse =
            await axios.get(
              "http://localhost:5000/api/orders"
            );

          const currentOrder =
            orderResponse.data.find(
              (item) =>
                item._id ===
                orderId
            );

          // SET LOCATION

          if (
            locationResponse.data
          ) {

            setLocation(
              locationResponse.data
            );
          }

          // SET STATUS

          if (currentOrder) {

            setOrderStatus(
              currentOrder.orderStatus
            );
          }

        } catch (error) {

          console.log(error);
        }
      },
      [orderId]
    );

  // INITIAL FETCH

  useEffect(() => {

    fetchLocation();

  }, [fetchLocation]);

  // SOCKET LIVE UPDATES

  useEffect(() => {

    socket.on(
      "LOCATION_UPDATED",
      (data) => {

        if (
          data.orderId ===
          orderId
        ) {

          setLocation(data);
        }
      }
    );

    socket.on(
      "ORDER_UPDATED",
      () => {

        fetchLocation();
      }
    );

    return () => {

      socket.off(
        "LOCATION_UPDATED"
      );

      socket.off(
        "ORDER_UPDATED"
      );
    };

  }, [
    fetchLocation,
    orderId,
  ]);

  // NO ORDER

  if (!orderId) {

    return (

      <div className="h-screen flex justify-center items-center text-4xl font-bold">

        No Active Order Found

      </div>
    );
  }

  // MAP LOADING

  if (!isLoaded) {

    return (

      <div className="h-screen flex justify-center items-center text-3xl font-bold">

        Loading Map...

      </div>
    );
  }

  // WAIT GPS

  if (
    !location &&
    orderStatus !==
      "DELIVERED"
  ) {

    return (

      <div className="h-screen flex flex-col justify-center items-center bg-gray-100">

        <div className="bg-white shadow-2xl rounded-3xl p-10 text-center">

          <h1 className="text-4xl font-bold">

            🚚 Tracking Started

          </h1>

          <p className="text-gray-500 mt-4 text-xl">

            Waiting For Delivery Agent GPS...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="w-full h-screen relative">

      {/* MAP */}

      {
        location &&
        orderStatus !==
          "DELIVERED" && (

          <GoogleMap
            mapContainerStyle={
              containerStyle
            }
            center={{
              lat:
                location.latitude,

              lng:
                location.longitude,
            }}
            zoom={15}
          >

            {/* MARKER */}

            <Marker
              position={{
                lat:
                  location.latitude,

                lng:
                  location.longitude,
              }}
            />

          </GoogleMap>
        )
      }

      {/* DELIVERED SCREEN */}

      {
        orderStatus ===
        "DELIVERED" && (

          <div className="h-screen flex justify-center items-center bg-green-50">

            <div className="bg-white shadow-2xl rounded-3xl p-12 text-center max-w-xl">

              <div className="text-7xl mb-5">

                ✅

              </div>

              <h1 className="text-5xl font-bold text-green-600">

                Order Delivered

              </h1>

              <p className="text-gray-500 text-xl mt-5">

                Your groceries have been delivered successfully.

              </p>

              <p className="mt-6 text-lg font-bold">

                Order ID:
                {" "}
                #{orderId.slice(-6)}

              </p>

            </div>

          </div>
        )
      }

      {/* LIVE STATUS */}

      {
        orderStatus !==
        "DELIVERED" && (

          <div className="absolute top-5 left-5 bg-white shadow-2xl rounded-2xl p-5 z-50">

            <h2 className="text-2xl font-bold">

              🚚 Delivery Live Tracking

            </h2>

            <p className="mt-2 text-gray-600">

              Order ID:
              {" "}
              #{orderId.slice(-6)}

            </p>

            {
              orderStatus ===
              "OUT_FOR_DELIVERY" ? (

                <p className="text-blue-600 font-bold text-2xl mt-4">

                  🚚 Delivery Partner is moving...

                </p>

              ) : orderStatus ===
                "READY" ? (

                <p className="text-yellow-600 font-bold text-2xl mt-4">

                  📦 Order packed and waiting for rider

                </p>

              ) : orderStatus ===
                "PICKING" ? (

                <p className="text-orange-600 font-bold text-2xl mt-4">

                  🛒 Picker is preparing your order

                </p>

              ) : (

                <p className="text-gray-600 font-bold text-2xl mt-4">

                  ⏳ Order placed successfully

                </p>
              )
            }

          </div>
        )
      }

    </div>
  );
};

export default TrackingPage;