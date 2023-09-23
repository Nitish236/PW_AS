//                   Finds Mean, Minimum and Maximum

const findMMM = async (records) => {
  let totalSalary = 0.0,
    minSalary = records[0].salary,
    maxSalary = records[0].salary;

  // Calculate the SS
  records.forEach((record) => {
    if (record.salary < minSalary) minSalary = record.salary;

    if (record.salary > maxSalary) maxSalary = record.salary;

    totalSalary += record.salary;
  });

  // Send the SS
  return {
    mean: parseFloat((totalSalary / records.length).toFixed(2)),
    min: minSalary,
    max: maxSalary,
  };
};

module.exports = {
  findMMM,
};
