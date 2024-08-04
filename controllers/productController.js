const asyncHandler = require("express-async-handler");
const Product = require("../model/productModels");

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user_id: req.user.id });

  res.status(200).json({
    products,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const { model, brand, price, storage } = req.body;

  if (!model || !brand || !price || !storage) {
    res.status(400);
    throw new Error("All Field Are Required");
  }

  const product = await Product.create({
    model,
    brand,
    price,
    storage,
    user_id: req.user.id,
  });
  res.status(201).json(product);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user product");
  }

  const updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updateProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user product");
  }

  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({
    product,
  });
});

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
