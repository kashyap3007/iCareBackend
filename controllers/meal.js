const Meal = require("../models/meal");
const User = require('../models/user')

/*
  Simpliar to userId, it will be very handy for later 
*/
exports.getMealById = (req, res, next, id) => {
  console.log("Inside mealID")
  console.log(id)
  Meal.findById(id)
    .exec((err, meal) => {
      if (err) {
        return res.status(40).json({
          "error": "NO order found in DB!"
        });
      }
      req.meal = meal;
      next();
    });
};


exports.getSingleMealById = (req, res) => {
  console.log('getSingleMealById')
  console.log(req.meal)
  return res.json(req.meal);
}

/*
  Whenevr we will create any meal, we have to update our User model too.
  So first make a meal
  Then update the user as he has taken some delicoius food...
*/
exports.createMeal = (req, res) => {

  console.log("Crate meal")

  req.body.meal.username = req.profile.username; //Injecting username to meal obj

  const meal = new Meal(req.body.meal);

  console.log("Inside meal create");

  meal.save((err, meal) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save your meal in DB"
      });
    }

    //Update user.meal
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { meals : meal._id} },
      { new: true },
      (error, user) => {
        if (error) {
          return res.status(400).json({
            error: "Unable to save meal list"
          });
        }

        res.json(user);
        
      }
    );

  });
};



/*
  Delete meal based on id
  This id we'll get from params. We just need to delete it.
  And then update out User model
*/

// Queries 5
exports.deleteMeal = (req, res) => {

  console.log("INside deleteMeal")
  Meal.findByIdAndDelete(req.params.mealId, (err, meal) => {
    if (err || !meal) {
      return res.status(400).json({
        "error": "Deletion Failed! Try Again.."
      });
    }

    //Update User schema
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $pull: { meals : req.params.mealId} },
      { safe: true },
      (error, user) => {
        if (error) {
          return res.status(400).json({
            error: "Unable to Update meals list"
          });
        }

        res.json(user);
        
      }
    );
  })
}



/*
  Update a meal based on params
*/
exports.updateMeal = (req,res) => {
  console.log("Update meall")
  console.log(req.body)
  Meal.findByIdAndUpdate(
    req.body._id, 
    { $set:  {foodname : req.body.foodname, description : req.body.description, calorie : req.body.calorie} },
    { new: true, useFindAndModify: false },
    (err, meal) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this!!"
        });
      }
      res.json(meal);
    })
}


/*
  Delete all meal based on username
  Ideally when user is logged in only then he can delete stuffs.
  So if he's logged in then his profile is already there in the req
  So we will grab the id/username as both are unique in our case and delete it.
  And then just update the User model
*/
//Queries 6
exports.deleteAllMeal = (req, res) => {
  console.log("deleteAllMeal")
  console.log(req.profile.username)

  Meal.deleteMany({username : req.profile.username}, (err, meal) => {
    if (err || !meal) {
      return res.status(400).json({
        "error": "Deletion Failed! Try Again.."
      });
    }
    console.log(meal)

    //Update User schema
    User.findByIdAndUpdate(
      { _id: req.profile._id },
      { meals: [] },
      (error, user) => {
        if (error) {
          return res.status(400).json({
            error: "Unable to Update meals list"
          });
        }

        res.json(user);
        
      }
    );
  })
}


/*
  Get all meals of a particula use, again only logged user can see his stuff, 
  so grab the usrname from req, and query 
*/
//Queries 7
exports.getAllMeals = (req, res) => {
  console.log('All meals')
  const username = req.query.username;
  

  var createdAt = {
    $gte: new Date('1111-12-01'), 
    $lt: new Date('9999-12-30') 
  } 

  if(req.query.filter) {
    console.log("HEllo wolrd")
    var tomm = new Date(new Date(req.query.filter).setDate(new Date(req.query.filter).getDate() + 1));
    console.log(tomm)
    createdAt = {
      $gte: new Date(req.query.filter), 
      $lt: new Date(tomm.toISOString().substr(0, 10)) 
    }
  }

  console.log(createdAt)

  Meal.find
    (
      {
        username : username,
        createdAt : createdAt
      }
    )
    .exec((err, meal) => {
      if (err) {
        return res.status(402).json({
          error: "No meals found in DB"
        });
      }
      res.json(meal);
    });
};


/*
  
*/
//Queries 8
exports.getAllMealsOnDate = (req, res) => {
  const dateToFetch = '2020-12-26';
  Meal.find
  (
    {
      username : req.profile.username,
      createdAt: { 
        $gte: new Date("2020-12-31"), 
        $lt: new Date("2021-01-01") 
      }
    }, 
    {},
    {
      sort:{ createdAt: -1 }
    }
  )
  .exec((err, accounts) =>{
    console.log(accounts);
    res.json(accounts);
  })
}



/*
  Key is aggreagte method and the syntax, 
  Here we are responding as an obj like {isLimitCrossed : true/false}
*/
exports.isExceededHisLimit = (req, res) => {
  const username = req.profile.username;
  Meal.aggregate(
    [
      { $match: {username : username} },
      {
        $group: {
          _id : "$username",
          calorie: {
            $sum: "$calorie"
          }
        }
      }
    ], 
    (err, result) => {
      console.log(result.length == 0 ? "0" : "1")
      if (err || result.length == 0) {
        return res.status(400).send(err);
      }
      console.log(result[0].calorie)
      res.json({
        "isLimitCrossed" : result[0].calorie,
        calories_per_day : req.profile.calories_per_day
      })
    }
  );
}





//Testing 
exports.deleteAllMealByName = (req, res) => {

  console.log("HEllo")

  Meal.deleteMany({username : "david"}, (err, meal) => {
    if (err || !meal) {
      return res.status(400).json({
        "error": "Deletion Failed! Try Again.."
      });
    }
    console.log(meal)
    res.send(meal);
  })
}
