const mongoose = require("mongoose");

const { Schema, Types } = mongoose;

const SaleProjectSchema = new mongoose.Schema(
  {
    project_date: {
      type: Date,
      required: true,
    },
    recieved_month: {
      type: String,
      maxlength: 20,
    },
    project_name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    project_id: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    link_received: {
      type: String,
      maxlength: 255,
    },
    client_name: {
      type: String,
      maxlength: 100,
    },
    specification: {
      type: String, // `Text` in SQL maps to `String` in MongoDB
    },
    country_name: {
      type: String,
      maxlength: 255,
    },
    sales_rep: {
      type: String,
      maxlength: 100,
    },
    loi: {
      type: Number,
    },
    ir: {
      type: Number,
    },
    type: {
      type: String,
      maxlength: 255,
    },
    current_status: {
      type: String,
      maxlength: 255,
    },
    initial_bidded_cpi: {
      type: Schema.Types.Decimal128,
      default: null,
      set: (v) => (v === "" ? null : v),
    },
    client_approved_bidded_cpi: {
      type: Schema.Types.Decimal128,
      default: null,
      set: (v) => (v === "" ? null : v),
    },
    approved_completes: {
      type: Number,
    },
    rejection: {
      type: Number,
    },
    final_approved_invoicing_cost: {
      type: Schema.Types.Decimal128,
      default: null,
      set: (v) => (v === "" ? null : v),
    },
    supplier_cost: {
      type: Schema.Types.Decimal128,
      default: null,
      set: (v) => (v === "" ? null : v),
    },
    gross_margin: {
      type: Schema.Types.Decimal128,
      default: null,
      set: (v) => (v === "" ? null : v),
    },
    profit_margin: {
      type: Schema.Types.Decimal128,
      default: null,
      set: (v) => (v === "" ? null : v),
    },
    supplier_po: {
      type: String,
      maxlength: 255,
      set: (v) => (v === "" ? null : v),
    },
    closure_date: {
      type: Date,
    },
    client_invoice: {
      type: String,
      maxlength: 255,
    },
    invoicing_month: {
      type: String,
      maxlength: 20,
    },
    invoicing_date: {
      type: Date,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

SaleProjectSchema.pre("save", function (next) {
  const decimalFields = [
    "initial_bidded_cpi",
    "client_approved_bidded_cpi",
    "final_approved_invoicing_cost",
    "supplier_cost",
    "gross_margin",
    "profit_margin",
  ];

  decimalFields.forEach((field) => {
    if (this[field] === "") this[field] = null;
  });

  next();
});

module.exports = mongoose.model("SaleProject", SaleProjectSchema);
