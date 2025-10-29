// import mongoose from "mongoose";

// const userSchema = mongoose.Schema({
//     fullname: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// });
// const User = mongoose.model("User", userSchema);
// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  address: [
    {
      label: String,
      houseNumber: String,
      area: String,
      taluk: String,
      district: String,
      state: String,
      country: String,
      pincode: String,
      primaryPhone: String,
      secondaryPhone: String
    }
  ]
});



// const userSchema = new mongoose.Schema({
//   fullname: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   address: [addressSchema], // address is now an array of address objects
//    primaryPhone: { type: String, required: true },
// secondaryPhone: { type: String },
// });

export default mongoose.model("User", userSchema);

