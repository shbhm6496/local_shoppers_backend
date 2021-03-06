import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Address from "../models/AddressModel.js";
import User from "../models/UserModel.js";

const getAddresses = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const user_id = req.query.user_id;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(user_id).populate("addresses");

  if (user) {
    const addresses = user.addresses;

    return res.status(200).json({ addresses: addresses ? addresses : [] });
  }

  return res.status(400).json({
    message: "Invalid user id",
  });
});

const createAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const user_id = req.body.user_id;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(user_id);

  if (user) {
    const {
      fullName,
      mobileNumber,
      pincode,
      flatNo,
      city,
      state,
      street,
      landmark,
    } = req.body;

    const address = await Address.create({
      fullName,
      mobileNumber,
      pincode,
      flatNo,
      city,
      state,
      street,
      landmark,
    });

    user.addresses.push(address);
    await user.save();

    return res.status(201).json({ address });
  }

  return res.status(400).json({
    message: "Invalid user id",
  });
});

const getAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const address_id = req.params.address_id;

  if (!mongoose.Types.ObjectId.isValid(address_id)) {
    return res.status(400).json({
      message: "Invalid address id",
    });
  }

  const address = await Address.findById(address_id);

  if (address) {
    return res.status(200).json({ address });
  }

  return res.status(400).json({
    message: "Invalid address id",
  });
});

const editAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const address_id = req.params.address_id;

  if (!mongoose.Types.ObjectId.isValid(address_id)) {
    return res.status(400).json({
      message: "Invalid address id",
    });
  }

  const address = await Address.findById(address_id);

  if (address) {
    const fullName = req.body.fullName || address.fullName;
    const mobileNumber = req.body.mobileNumber || address.mobileNumber;
    const flatNo = req.body.flatNo || address.flatNo;
    const city = req.body.city || address.city;
    const state = req.body.state || address.state;
    const landmark = req.body.landmark || address.landmark;
    const street = req.body.street || address.street;
    const pincode = req.body.pincode || address.pincode;

    address.fullName = fullName;
    address.mobileNumber = mobileNumber;
    address.flatNo = flatNo;
    address.city = city;
    address.state = state;
    address.landmark = landmark;
    address.street = street;
    address.pincode = pincode;

    await address.save();

    return res.status(200).json({ address });
  }

  return res.status(400).json({
    message: "Invalid address id",
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const address_id = req.params.address_id;

  if (!mongoose.Types.ObjectId.isValid(address_id)) {
    return res.status(400).json({
      message: "Invalid address id",
    });
  }

  const address = await Address.findById(address_id);

  if (address) {
    await address.delete();
    return res.status(200).json({ message: "Address deleted successfully" });
  }

  return res.status(400).json({
    message: "Invalid address id",
  });
});
export { getAddresses, createAddress, getAddress, editAddress, deleteAddress };
