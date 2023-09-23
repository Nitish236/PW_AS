const { Schema, model } = require("mongoose");

// Schema

const recordSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  salary: {
    type: Number,
    required: [true, "Salary is required"],
  },
  currency: {
    type: String,
    required: [true, "Currency is required"],
  },
  department: {
    type: String,
    required: [true, "Department is required"],
  },
  sub_department: {
    type: String,
    required: [true, "Sub_department is required"],
  },
  on_contract: {
    type: Boolean,
    default: false,
    enum: [true, false],
    select: false,
  },
});

// Model

module.exports = model("Record", recordSchema);
