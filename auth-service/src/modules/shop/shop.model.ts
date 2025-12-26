import { model, Schema } from "mongoose";
import type { TShop } from "./shop.interface.js";

const shopSchema = new Schema<TShop>(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    coverBanner: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      required: true,
    },
    openingHours: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: null,
    },
    socialLinks: {
      type: Object,
      default: null,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: "ShopReview",
      default: [],
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Shop = model<TShop>("Shop", shopSchema);
export default Shop;
