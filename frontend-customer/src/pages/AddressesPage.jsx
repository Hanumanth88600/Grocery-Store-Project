import React,
{
  useEffect,
  useState,
} from "react";

const AddressesPage = () => {

  const [addresses,
    setAddresses] =
    useState([]);

  const [formData,
    setFormData] =
    useState({

      fullAddress: "",

      city: "",

      pincode: "",
    });

  // LOAD SAVED

  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "addresses"
        )
      ) || [];

    setAddresses(saved);

  }, []);

  // INPUT

  const changeHandler =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      });
    };

  // SAVE ADDRESS

  const saveAddress =
    () => {

      if (
        !formData.fullAddress ||
        !formData.city ||
        !formData.pincode
      ) {

        alert(
          "Fill all fields"
        );

        return;
      }

      const updated =
        [
          ...addresses,
          formData,
        ];

      setAddresses(updated);

      localStorage.setItem(
        "addresses",
        JSON.stringify(
          updated
        )
      );

      setFormData({

        fullAddress: "",

        city: "",

        pincode: "",
      });
    };

  // DELETE

  const deleteAddress =
    (index) => {

      const updated =
        addresses.filter(
          (_, i) =>
            i !== index
        );

      setAddresses(updated);

      localStorage.setItem(
        "addresses",
        JSON.stringify(
          updated
        )
      );
    };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-5xl font-bold mb-10">

        Saved Addresses

      </h1>

      {/* ADD FORM */}

      <div className="bg-white p-6 rounded-3xl shadow-xl mb-10 max-w-2xl">

        <div className="space-y-5">

          <textarea
            rows="4"
            placeholder="Full Address"
            name="fullAddress"
            value={
              formData.fullAddress
            }
            onChange={
              changeHandler
            }
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="text"
            placeholder="City"
            name="city"
            value={
              formData.city
            }
            onChange={
              changeHandler
            }
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="text"
            placeholder="Pincode"
            name="pincode"
            value={
              formData.pincode
            }
            onChange={
              changeHandler
            }
            className="w-full border p-4 rounded-2xl"
          />

          <button
            onClick={
              saveAddress
            }
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
          >

            Save Address

          </button>

        </div>

      </div>

      {/* ADDRESS LIST */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {
          addresses.map(
            (
              address,
              index
            ) => (

              <div
                key={index}
                className="bg-white p-6 rounded-3xl shadow-xl"
              >

                <h2 className="text-xl font-bold">

                  {address.city}

                </h2>

                <p className="text-gray-600 mt-3">

                  {
                    address.fullAddress
                  }

                </p>

                <p className="font-bold mt-3">

                  {
                    address.pincode
                  }

                </p>

                <button
                  onClick={() =>
                    deleteAddress(
                      index
                    )
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl mt-5"
                >

                  Delete

                </button>

              </div>
            )
          )
        }

      </div>

    </div>
  );
};

export default AddressesPage;