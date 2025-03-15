const express = require("express");
const router = express.Router();
const { createUser, getUsers, getUserById, login } = require("./user.controller");
const auth = require("../middleware/auth");

console.log("createUser function:", createUser);
console.log("createUser function:", getUsers);
console.log("createUser function:",auth, login);
console.log("createUser function:", getUserById);

router.post("/", createUser);
router.get("/all", getUsers);
router.get("/", auth, getUserById);
router.post("/login",login)

module.exports = router;
