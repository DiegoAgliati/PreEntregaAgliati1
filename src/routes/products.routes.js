import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let { category, sort, page = 1, limit = 10 } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let filter = {};
    if (category && category !== "null") {
    filter.category = { $regex: new RegExp("^" + category + "$", "i") };
}


    let sortOptions = {};

    if (sort === "asc") sortOptions.price = 1;
    if (sort === "desc") sortOptions.price = -1;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sortOptions)
      .lean();

    const categories = await Product.distinct("category");

    res.render("index", {
      payload: products,
      page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : 1,
      nextPage: page < totalPages ? page + 1 : totalPages,
      categories,
      sort: sort || "none",
      query: category || "",
      limit,
    });
  } catch (error) {
    console.error("Error en la API:", error);
    res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
});

export default router;