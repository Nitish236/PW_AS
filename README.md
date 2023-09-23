# PW_AS

## Getting Started

To get started with the project "PW_AS" follow these steps:

### Navigate to the project directory: (run)

cd PW_AS

### Install the required packages: (run)

npm install

### Start the server:

npm start

Now the server will be running :-

I have provided the `.env file` for the project, so there's no need to create one. It contains the necessary variables.

The database credentials will work for 3 days only and can access the `PW` database only specified in the `.env` file

## Postman Workspace

You can use the following link to access the Postman workspace for this project:

`Postman Workspace` :- https://app.getpostman.com/join-team?invite_code=7719c2a7797e37acc616cf61e6d514b5&target_code=be8698f183b1a2105fe44c72a1763d85

Anyone reading this `README` can join the public workspace using the provided link to run the APIs associated with the project.

`Github Link` :- https://github.com/Nitish236/PW_AS

## APIs Endpoint

front url would be :- `http:localhost:3000`

prefix each request with this above url

### Records

1. Create Record

   `/api/records/create` - POST request

   body should contain :-

   {
   "name": "Nitish verma",
   "salary": "190000",
   "currency": "USD",
   "department": "Engineering",
   "sub_department": "Platform"
   // "on_contract":true // Optional
   }

2. Delete Record

   `/api/records/delete:id` - DELETE request

   where id should be a valid ObjectId

3. Get SS for all dataset

   `/api/records/ss/all` - POST request

   body will contain :-

   {
   "currency" : "USD" // optional
   }

4. Get SS for all Contract one's

   `/api/records/ss/onCon` - GET request

5. Get SS for all Departments

   `/api/records/ss/dep` - GET request

6. Get SS for all Dep and sub department combination

   `/api/records/ss/dep/sub` - GET request

### User

1. Log In

   `/api/login` - POST request

   body should contain :

   {
   "username": "Nitish",
   "password": "nitish123"
   }

2. Log Out

   `/api/logout` - POST request

3. Sign Up

   `/api/signup` - POST request

   body should contain :-

   {
   "username": "Nitish",
   "role" : "user",
   "password": "nitish123"
   }

## To start the testing process

### For testing

first stop the server if its running using `Ctrl + C` two times

### Navigate to the project directory (If not already there): (run)

cd PW_AS

### Start the Testing: (run)

npm test

There are total of 9 test cases

1. ✔ Log In as Nitish(user)
2. ✔ Create a record
3. ✔ Delete a record
4. ✔ Get SS for all dataset if currency is specified as 'USD
5. ✔ Get SS for all dataset if currency is not specified
6. ✔ Get SS for all dataset for contract one's (contract: true)
7. ✔ Get SS for each unique department
8. ✔ Get SS for each department and sub department combination
9. ✔ Log Out as Nitish(user)
