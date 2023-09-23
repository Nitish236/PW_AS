const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");

// Errors
const {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
} = require("../errors/allErr");

// Models
const Record = require("../models/recordModel");

// Utilities
const { findMMM } = require("../utils/findSS");

/* ---------------------------------------------------------------------------- */

//                              Function to Add a new Record

const addRecord = async (req, res) => {
  // Retrieve data
  const data = req.body;

  const allowedFields = new Set([
    "name",
    "salary",
    "currency",
    "department",
    "sub_department",
  ]);

  // Validate fields
  for (const field in allowedFields.keys()) {
    if (!data[field]) throw new BadRequestError(`${field} cannot be empty`);
  }

  let recordData = {
    name: data.name,
    salary: data.salary,
    currency: data.currency,
    department: data.department,
    sub_department: data.sub_department,
  };

  // If contract field is present
  if (data.on_contract) {
    recordData.on_contract = data.on_contract;
  }

  // Create the record
  const record = await Record.create(recordData);

  // If record does not get created
  if (!record) {
    throw new CustomAPIError("Server error try after sometime");
  }

  const { _v, ...newRecord } = record._doc;

  // Send the response
  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "Record created successfully",
    record: newRecord,
  });
};

//                              Function to Delete a Record

const deleteRecord = async (req, res) => {
  // Retrieve record id
  const recordId = req.params.id;

  // Validate the record id
  if (!recordId || !ObjectId.isValid(recordId))
    throw new BadRequestError("Record Id is empty or not valid");

  // Delete the record
  const record = await Record.findByIdAndDelete(recordId);

  // If no such record exists
  if (!record)
    throw new NotFoundError("Record you are trying to delete doesn't exist");

  // Send the response
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    msg: "Record deleted successfully",
    record,
  });
};

//                              Function to calculate SS for salary for all Records

const ssForSalary = async (req, res) => {
  // Retrieve currency if present
  const currency = req.body.currency;

  let query = {};

  // If currency is given
  if (currency) {
    query["currency"] = currency;
  }

  // Get all the Records
  const records = await Record.find(query);

  // If no records are found
  if (records.length == 0) {
    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "No records Found" });
  }

  // Find the SS
  const result = await findMMM(records);

  // Send the SS
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Summary Statistics on salary for all dataset",
    ss: {
      mean: result.mean,
      min: result.min,
      max: result.max,
    },
  });
};

//                              Function to calculate SS for salary for on_contract: true

const ssForSalaryOnContract = async (req, res) => {
  // Get all the Records
  let records = await Record.find({ on_contract: true });

  // If no records are found
  if (records.length == 0)
    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "No records Found" });

  // Find SS
  const result = await findMMM(records);

  // Send the SS
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Summary Statistics on salary which are on contract",
    ss: {
      mean: result.mean,
      min: result.min,
      max: result.max,
    },
  });
};

//                              Function to calculate SS for salary for each department

const ssForSalaryOnDepartment = async (req, res) => {
  // Get all the Records
  let records = await Record.find();

  // If no records are found
  if (records.length == 0)
    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "No records Found" });

  // To store SS for each department
  let ss = {};

  let departments = new Set();

  // Get unique departments
  records.forEach((record) => {
    departments.add(record.department);
  });

  // For each Department
  for (const dep of departments.keys()) {
    const tempRecords = records.filter((record) => record.department === dep);

    // Find SS for each department
    let result = await findMMM(tempRecords);

    // Add the department wise SS
    ss[dep] = {
      mean: result.mean,
      min: result.min,
      max: result.max,
    };
  }

  // Send the SS for each department
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Summary Statistics on salary for each department",
    ss,
  });
};

//                              Function to calculate SS for salary for each deaprtment and sub department combination

const ssForSalaryOnDepAndSubDep = async (req, res) => {
  // Get all the Records
  let records = await Record.find();

  // If no records are found
  if (records.length == 0)
    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "No records Found" });

  // To store SS for each department
  let ss = {};

  let departments = new Set();

  // Get unique departments
  records.forEach((record) => {
    departments.add(`${record.department}-${record.sub_department}`);
  });

  // For each Department and sub department
  for (const dep_sub of departments.keys()) {
    const tempRecords = records.filter(
      (record) => `${record.department}-${record.sub_department}` == dep_sub
    );

    // Find SS for each department
    let result = await findMMM(tempRecords);

    // Add the department wise SS
    ss[dep_sub] = {
      mean: result.mean,
      min: result.min,
      max: result.max,
    };
  }

  // Send the SS for each department
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Summary Statistics on salary for each department and sub department combination",
    ss,
  });
};

// Export the functionalities

module.exports = {
  addRecord,
  deleteRecord,
  ssForSalary,
  ssForSalaryOnContract,
  ssForSalaryOnDepartment,
  ssForSalaryOnDepAndSubDep,
};
