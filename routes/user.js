const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, getUser, getAllUser, updateUser, deleteUser, userPurchaseList} = require("../controllers/user");
const { createMeal, getAllMeals, getMealById, deleteMeal, deleteAllMeal, getAllMealsOnDate, deleteAllMealByName, isExceededHisLimit} = require("../controllers/meal");

//PARAMS
router.param("userId", getUserById);


//Fetch all meals 
router.get('/user/:userId', getAllMeals)

/* GET users listing. */
router.get("/user/details/:userId", getUser);

router.put("/user/update/:userId", updateUser);

router.get('/filter', (req, res) => {
	res.render('dashboardRight')
})

router.get('/update', (req, res) => {
	res.render('updatemeal', {error : ""})
})

//Is Exceed limit
router.get('/user/checklimit/:userId', isExceededHisLimit)





// For Admin
router.delete('/admin/:username/:userId', isSignedIn, isAuthenticated, isAdmin, deleteUser);

router.get('/admin/users/:userId', isSignedIn, isAuthenticated, isAdmin, getAllUser);

// router.get( "/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);
module.exports = router;