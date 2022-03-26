const User = require("../models/user");
const Meal = require("../models/meal");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.profile = user;
    next();
  });
};


exports.getUser = (req, res) => {
  console.log("Get user")
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  console.log(req.profile)
  return res.json(req.profile);
};

exports.getAllUser = (req, res) => {
  User.find({}).select({username:1, firstname:1, lastname:1, email:1, phone:1, calories_per_day:1}).lean()
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({
        error : err
      })
    })
}

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user"
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};




// *******************************    For Admin *********************************
/*
  Delete a user from the Database, since meal is also connected to user so whenevr any user info is changed
  in db, we should always modify our db accordingly
*/
exports.deleteUser = (req, res) => {
  console.log('deleteUser')

  const username = req.params.username;

  User.findOneAndDelete({username}, function (err, docs) { 
      if(err || !docs) {
        return res.status(400).json({err : "Unable to delete " + username})
      }

      //Update Meal collection
      Meal.deleteMany({username : username}, (erro, meal) => {
        if(erro || !meal) {
          return res.status(400).json({erro : "Unable to delete " + username})
        }
        res.json({"Success" : username + " Deleted Successfully"})
      })
  });
}


// exports.userPurchaseList = (req, res) => {
//   Order.find({ user: req.profile._id })
//     .populate("user", "_id name")
//     .exec((err, order) => {
//       if (err) {
//         return res.status(400).json({
//           error: "No Order in this account"
//         });
//       }
//       return res.json(order);
//     });
// };

// exports.pushOrderInPurchaseList = (req, res, next) => {
//   let purchases = [];
//   req.body.order.products.forEach(product => {
//     purchases.push({
//       _id: product._id,
//       name: product.name,
//       description: product.description,
//       category: product.category,
//       quantity: product.quantity,
//       amount: req.body.order.amount,
//       transaction_id: req.body.order.transaction_id
//     });
//   });

//   //store thi in DB
//   User.findOneAndUpdate(
//     { _id: req.profile._id },
//     { $push: { purchases: purchases } },
//     { new: true },
//     (err, purchases) => {
//       if (err) {
//         return res.status(400).json({
//           error: "Unable to save purchase list"
//         });
//       }
//       next();
//     }
//   );
// };
