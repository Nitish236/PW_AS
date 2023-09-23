const router = require("express").Router();

// Records Controllers
const {
  addRecord,
  deleteRecord,
  ssForSalary,
  ssForSalaryOnContract,
  ssForSalaryOnDepartment,
  ssForSalaryOnDepAndSubDep,
} = require("../controllers/recordController");

/* ------------------------------------------------------- */

router.route("/records/create").post(addRecord); // To create new Record

router.route("/records/delete/:id").delete(deleteRecord); // To delete a record

router.route("/records/ss/all").post(ssForSalary); // To get SS for all dataset

router.route("/records/ss/onCon").get(ssForSalaryOnContract); // To get SS for contract's one's only

router.route("/records/ss/dep").get(ssForSalaryOnDepartment); // To get SS for Each Department

router.route("/records/ss/dep/sub").get(ssForSalaryOnDepAndSubDep); // To get SS for each Department and sub deprtament combination

// Export the Router

module.exports = router;
