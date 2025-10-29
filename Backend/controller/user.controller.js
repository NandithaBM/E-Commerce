// import User from "../model/user.model.js";
// import bcryptjs from "bcryptjs";
// export const signup = async(req, res) => {
//     try {
//         const { fullname, email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: "User already exists" });
//         }
//         const hashPassword = await bcryptjs.hash(password, 10);
//         const createdUser = new User({
//             fullname: fullname,
//             email: email,
//             password: hashPassword,
//         });
//         await createdUser.save();
//         res.status(201).json({
//             message: "User created successfully",
//             user: {
//                 _id: createdUser._id,
//                 fullname: createdUser.fullname,
//                 email: createdUser.email,
//             },
//         });
//     } catch (error) {
//         console.log("Error: " + error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };
// export const login = async(req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         const isMatch = await bcryptjs.compare(password, user.password);
//         if (!user || !isMatch) {
//             return res.status(400).json({ message: "Invalid username or password" });
//         } else {
//             res.status(200).json({
//                 message: "Login successful",
//                 user: {
//                     _id: user._id,
//                     fullname: user.fullname,
//                     email: user.email,
//                 },
//             });
//         }
//     } catch (error) {
//         console.log("Error: " + error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// import User from "../model/user.model.js";
// import bcryptjs from "bcryptjs";

// export const signup = async (req, res) => {
//   try {
//     const { fullname, email, password, address } = req.body;

//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashPassword = await bcryptjs.hash(password, 10);

//     const createdUser = new User({
//       fullname,
//       email,
//       password: hashPassword,
//       address: {
//         houseNumber: address?.houseNumber || "",
//         area: address?.area || "",
//         taluk: address?.taluk || "",
//         district: address?.district || "",
//         state: address?.state || "",
//         country: address?.country || "",
//         pincode: address?.pincode || "",
//       },
//     });

//     await createdUser.save();

//     res.status(201).json({
//       message: "User created successfully",
//       user: {
//         _id: createdUser._id,
//         fullname: createdUser.fullname,
//         email: createdUser.email,
//         address: createdUser.address,
//       },
//     });
//   } catch (error) {
//     console.error("Error during signup:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";

// ✅ User Signup
export const signup = async (req, res) => {
  try {
    const { fullname, email, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashPassword = await bcryptjs.hash(password, 10);

    // Create new user with optional address array
    const createdUser = new User({
      fullname,
      email,
      password: hashPassword,
      address: address ? [address] : [],
    });

    await createdUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
        address: createdUser.address,
      },
    });
  } catch (error) {
    console.error("❌ Error during signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Add Address
export const addAddress = async (req, res) => {
  const { userId, newAddress } = req.body;

  console.log("🔥 [addAddress] Request body:", req.body);

  try {
    if (!userId || !newAddress) {
      console.log("🚫 Missing userId or newAddress");
      return res.status(400).json({ message: "Missing required data" });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found. Current addresses:", user.address);

    console.log("🔥 Request body:", req.body);
console.log("✅ User before push:", user);
console.log("📦 New Address:", newAddress);


    user.address.push({
  ...newAddress,
  primaryPhone: newAddress.primaryPhone,
  secondaryPhone: newAddress.secondaryPhone || "",
});


    await user.save();

    console.log("✅ Address added:", newAddress);

    res.status(200).json({
      message: "Address added successfully",
      address: user.address,
    });
  } catch (err) {
    console.error("❌ Unexpected backend error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Update Address
export const updateAddress = async (req, res) => {
  const { userId, index, updatedAddress } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.address[index] = updatedAddress;
    await user.save();

    res.status(200).json({ message: "Address updated", address: user.address });
  } catch (err) {
    console.error("❌ Update address error:", err.message);
    res.status(500).json({ message: "Internal error" });
  }
};

// ✅ Delete Address
export const deleteAddress = async (req, res) => {
  const { userId, index } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.address.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "Address deleted", address: user.address });
  } catch (err) {
    console.error("❌ Delete address error:", err.message);
    res.status(500).json({ message: "Internal error" });
  }
};
