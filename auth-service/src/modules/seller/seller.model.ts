import { model, Schema } from "mongoose";
import type { TSeller } from "./seller.interface.js";
import bcrypt from "bcrypt";
import config from "../../config/index.js";

const sellerSchema = new Schema<TSeller>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    stripeAccountId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// pre save middleware / hook
sellerSchema.pre("save", async function () {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round)
  );
});

//remove password string after saving data
sellerSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

const Seller = model<TSeller>("Seller", sellerSchema);

export default Seller;
