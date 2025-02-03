import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  thumbnails: { type: [String], default: [] },
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("products", productSchema);
export default Product;