import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("Users"));
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    houseNumber: "",
    area: "",
    taluk: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    label: "",
    primaryPhone: "",
    secondaryPhone: ""
  });

  useEffect(() => {
    if (userData?.address) {
      setAddresses(userData.address);
    }
  }, []);

  const handleChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setAddressForm({
      houseNumber: "",
      area: "",
      taluk: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
      label: "",
      primaryPhone: "",
      secondaryPhone: ""
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const updateLocalStorage = (updatedAddresses) => {
    const updatedUser = { ...userData, address: updatedAddresses };
    localStorage.setItem("Users", JSON.stringify(updatedUser));
  };

  const handleAddAddress = async () => {
    if (!addressForm.primaryPhone) {
      alert("Primary phone number is required.");
      return;
    }
    try {
      const res = await axios.put("http://localhost:4001/user/add-address", {
        userId: userData._id,
        newAddress: addressForm,
      });
      setAddresses(res.data.address);
      updateLocalStorage(res.data.address);
      resetForm();
    } catch (err) {
      console.error("Add address error:", err);
    }
  };

  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setAddressForm(addresses[index]);
    setIsAdding(true);
  };

  const handleUpdateAddress = async () => {
    if (!addressForm.primaryPhone.trim()) {
  alert("Primary phone number is required.");
  return;
}

  try {
    const res = await axios.put("http://localhost:4001/user/update-address", {
      userId: user._id,
      index: editingIndex,
      updatedAddress: addressForm,
    });

    const updatedUser = { ...userData, address: res.data.address };
localStorage.setItem("Users", JSON.stringify(updatedUser));
setAddresses(res.data.address); // refresh UI state too


  
    resetForm(); // reset form
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update address.");
  }
};


  const handleDeleteAddress = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await axios.put("http://localhost:4001/user/delete-address", {
        userId: userData._id,
        index,
      });
      setAddresses(res.data.address);
      updateLocalStorage(res.data.address);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>
      <p><strong>Name:</strong> {userData.fullname}</p>
      <p><strong>Email:</strong> {userData.email}</p>

      <button
        onClick={() => navigate("/ordered-items")}
        className="mt-4 mb-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        📋 Your Orders
      </button>

      {/* Addresses */}
      <h2 className="text-xl font-semibold mb-3">📦 Saved Addresses</h2>
      {addresses.length === 0 ? (
        <p>No addresses saved yet.</p>
      ) : (
        addresses.map((addr, i) => (
          <div key={i} className="border p-4 rounded-md mb-3 bg-gray-100 text-blue-900">
            <p><strong>{addr.label || `Address ${i + 1}`}</strong></p>
            <p>{addr.houseNumber}, {addr.area}, {addr.taluk}, {addr.district}</p>
            <p>{addr.state}, {addr.country} - {addr.pincode}</p>
            <p>
  📞{" "}
  {addr.primaryPhone ? (
    <>
      {addr.primaryPhone}
      {addr.secondaryPhone && ` / ${addr.secondaryPhone}`}
    </>
  ) : (
    <span className="text-red-500">Phone number not available</span>
  )}
</p>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEditAddress(i)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAddress(i)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Form */}
      <div className="mt-6">
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Add New Address
        </button>
      </div>

      {isAdding && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">
            {editingIndex !== null ? "✏️ Edit Address" : "➕ New Address"}
          </h3>
          {[
            "label", "houseNumber", "area", "taluk", "district",
            "state", "country", "pincode", "primaryPhone", "secondaryPhone"
          ].map((name) => (
            <div key={name} className="mb-3">
              <label className="block text-sm font-medium">
                {name === "primaryPhone" ? "Primary Phone (Required)" :
                 name === "secondaryPhone" ? "Secondary Phone (Optional)" :
                 name.charAt(0).toUpperCase() + name.slice(1)}
              </label>
              <input
                type="text"
                name={name}
                value={addressForm[name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}
          <div className="flex gap-3">
            <button
              onClick={editingIndex !== null ? handleUpdateAddress : handleAddAddress}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingIndex !== null ? "Update Address" : "Add Address"}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
