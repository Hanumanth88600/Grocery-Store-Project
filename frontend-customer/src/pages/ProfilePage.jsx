import {
  useNavigate,
} from "react-router-dom";

import React,
{
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
  FaUserCircle,
  FaCreditCard,
  FaLock,
  FaPhone,
  FaTrash,
} from "react-icons/fa";

import { motion }
from "framer-motion";

const ProfilePage = () => {

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const [profile,
    setProfile] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const [passwordData,
    setPasswordData] =
    useState({

      oldPassword: "",

      newPassword: "",
    });

  const [cardData,
    setCardData] =
    useState({

      cardHolder: "",

      cardNumber: "",

      expiry: "",
    });

  // LOGIN CHECK

  useEffect(() => {

    if (!user) {

      localStorage.setItem(
        "redirectAfterLogin",
        "/profile"
      );

      navigate("/login");
    }

  }, [user, navigate]);

  // FETCH PROFILE

  const fetchProfile =
    useCallback(async () => {

      if (!user) return;

      try {

        const { data } =
          await axios.get(
            `https://grocery-store-project-l9y7.onrender.com/api/profile/${user._id}`
          );

        setProfile(data);

      } catch (error) {

        console.log(error);
      }

    }, [user]);

  // LOAD PROFILE

  useEffect(() => {

    if (user) {

      fetchProfile();
    }

  }, [user, fetchProfile]);

  // UPDATE PROFILE

  const updateProfile =
    async () => {

      try {

        setLoading(true);

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/profile/update/${user._id}`,
          profile
        );

        localStorage.setItem(
          "user",
          JSON.stringify(profile)
        );

        alert(
          "Profile Updated Successfully"
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // CHANGE PASSWORD

  const changePassword =
    async () => {

      if (
        !passwordData.oldPassword ||
        !passwordData.newPassword
      ) {

        alert(
          "Please fill all fields"
        );

        return;
      }

      try {

        setLoading(true);

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/profile/password/${user._id}`,
          passwordData
        );

        alert(
          "Password Changed Successfully"
        );

        setPasswordData({

          oldPassword: "",

          newPassword: "",
        });

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
            "Password update failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // ADD CARD

  const addCard =
    async () => {

      if (
        !cardData.cardHolder ||
        !cardData.cardNumber ||
        !cardData.expiry
      ) {

        alert(
          "Please fill all card details"
        );

        return;
      }

      try {

        setLoading(true);

        await axios.post(
          `https://grocery-store-project-l9y7.onrender.com/api/profile/card/${user._id}`,
          cardData
        );

        alert(
          "Card Saved Successfully"
        );

        setCardData({

          cardHolder: "",

          cardNumber: "",

          expiry: "",
        });

        fetchProfile();

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // DELETE CARD

  const deleteCard =
    async (index) => {

      try {

        const updatedCards =
          profile.savedCards.filter(
            (_, i) =>
              i !== index
          );

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/profile/update/${user._id}`,
          {
            ...profile,
            savedCards:
              updatedCards,
          }
        );

        fetchProfile();

      } catch (error) {

        console.log(error);
      }
    };

  // LOADING

  if (!profile) {

    return (

      <div className="min-h-screen flex justify-center items-center text-4xl font-bold">

        Loading Profile...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="flex items-center gap-5 mb-10">

        {
          profile.avatar ? (

            <img
              src={profile.avatar}
              alt=""
              className="w-28 h-28 rounded-full object-cover border-4 border-green-500"
            />

          ) : (

            <FaUserCircle
              className="text-green-600"
              size={100}
            />
          )
        }

        <div>

          <h1 className="text-5xl font-bold">

            {profile.name}

          </h1>

          <p className="text-gray-500 mt-2 text-xl">

            {profile.email}

          </p>

        </div>

      </div>

      {/* GRID */}

      <div className="grid xl:grid-cols-2 gap-8">

        {/* PROFILE */}

        <motion.div
          whileHover={{
            y: -5,
          }}
          className="bg-white p-8 rounded-3xl shadow-xl"
        >

          <div className="flex items-center gap-3 mb-6">

            <FaUserCircle
              className="text-green-600"
              size={28}
            />

            <h2 className="text-3xl font-bold">

              Profile Details

            </h2>

          </div>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Avatar URL"
              value={
                profile.avatar || ""
              }
              onChange={(e) =>
                setProfile({

                  ...profile,

                  avatar:
                    e.target.value,
                })
              }
              className="w-full border p-4 rounded-2xl"
            />

            <input
              type="text"
              placeholder="Name"
              value={
                profile.name
              }
              onChange={(e) =>
                setProfile({

                  ...profile,

                  name:
                    e.target.value,
                })
              }
              className="w-full border p-4 rounded-2xl"
            />

            <div className="relative">

              <FaPhone
                className="absolute top-5 left-4 text-gray-400"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={
                  profile.phone || ""
                }
                onChange={(e) =>
                  setProfile({

                    ...profile,

                    phone:
                      e.target.value,
                  })
                }
                className="w-full border p-4 pl-12 rounded-2xl"
              />

            </div>

            <button
              onClick={
                updateProfile
              }
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-bold w-full"
            >

              {
                loading
                  ? "Saving..."
                  : "Save Profile"
              }

            </button>

          </div>

        </motion.div>

        {/* PASSWORD */}

        <motion.div
          whileHover={{
            y: -5,
          }}
          className="bg-white p-8 rounded-3xl shadow-xl"
        >

          <div className="flex items-center gap-3 mb-6">

            <FaLock
              className="text-blue-600"
              size={28}
            />

            <h2 className="text-3xl font-bold">

              Change Password

            </h2>

          </div>

          <div className="space-y-5">

            <input
              type="password"
              placeholder="Old Password"
              value={
                passwordData.oldPassword
              }
              onChange={(e) =>
                setPasswordData({

                  ...passwordData,

                  oldPassword:
                    e.target.value,
                })
              }
              className="w-full border p-4 rounded-2xl"
            />

            <input
              type="password"
              placeholder="New Password"
              value={
                passwordData.newPassword
              }
              onChange={(e) =>
                setPasswordData({

                  ...passwordData,

                  newPassword:
                    e.target.value,
                })
              }
              className="w-full border p-4 rounded-2xl"
            />

            <button
              onClick={
                changePassword
              }
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold w-full"
            >

              Update Password

            </button>

          </div>

        </motion.div>

      </div>

      {/* PAYMENT METHODS */}

      <motion.div
        whileHover={{
          y: -5,
        }}
        className="bg-white p-8 rounded-3xl shadow-xl mt-10"
      >

        <div className="flex items-center gap-3 mb-8">

          <FaCreditCard
            className="text-purple-600"
            size={28}
          />

          <h2 className="text-3xl font-bold">

            Saved Payment Methods

          </h2>

        </div>

        {/* ADD CARD */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <input
            type="text"
            placeholder="Card Holder"
            value={
              cardData.cardHolder
            }
            onChange={(e) =>
              setCardData({

                ...cardData,

                cardHolder:
                  e.target.value,
              })
            }
            className="border p-4 rounded-2xl"
          />

          <input
            type="text"
            placeholder="Card Number"
            value={
              cardData.cardNumber
            }
            onChange={(e) =>
              setCardData({

                ...cardData,

                cardNumber:
                  e.target.value,
              })
            }
            className="border p-4 rounded-2xl"
          />

          <input
            type="text"
            placeholder="Expiry"
            value={
              cardData.expiry
            }
            onChange={(e) =>
              setCardData({

                ...cardData,

                expiry:
                  e.target.value,
              })
            }
            className="border p-4 rounded-2xl"
          />

        </div>

        <button
          onClick={addCard}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-2xl font-bold"
        >

          Save Card

        </button>

        {/* CARD LIST */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

          {
            profile.savedCards?.map(
              (
                card,
                index
              ) => (

                <motion.div
                  whileHover={{
                    scale: 1.03,
                  }}
                  key={index}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-3xl relative"
                >

                  <button
                    onClick={() =>
                      deleteCard(index)
                    }
                    className="absolute top-4 right-4"
                  >

                    <FaTrash />

                  </button>

                  <h2 className="text-2xl font-bold mt-8">

                    **** **** ****
                    {" "}
                    {
                      card.cardNumber.slice(
                        -4
                      )
                    }

                  </h2>

                  <p className="mt-5 text-lg">

                    {
                      card.cardHolder
                    }

                  </p>

                  <p className="mt-2">

                    {
                      card.expiry
                    }

                  </p>

                </motion.div>
              )
            )
          }

        </div>

      </motion.div>

    </div>
  );
};

export default ProfilePage;