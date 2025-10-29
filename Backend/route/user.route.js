import express from "express";
// import { addAddress } from "../controller/user.controller.js";
import {
  signup,
  login,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controller/user.controller.js";

const router = express.Router(); 

router.post("/signup", signup);
router.post("/login", login);
router.put("/add-address", addAddress);
router.put("/update-address", updateAddress);
router.put("/delete-address", deleteAddress);

export default router;
