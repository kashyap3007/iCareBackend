const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user");
const { getMealById, createMeal, updateMeal, getAllMeals, getSingleMealById, deleteMeal} = require("../controllers/meal");

router.param("userId", getUserById);
router.param("mealId", getMealById);



router.get('/meals', getAllMeals)

router.get('/meal/:mealId', getSingleMealById)

router.post('/meal/:userId', createMeal);

router.put('/meal', updateMeal);

router.delete('/meal/:mealId/:userId', deleteMeal)



// router.get( "/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

// router.post('/addmeal/:userId', (req, res) => {
// 	res.json(req.body);	
// })

module.exports = router;





