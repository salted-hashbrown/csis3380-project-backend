const router = require("express").Router();
const objModel = require("../models/reviewModel");


// ---------------------------------------------------------
// List all 
// ---------------------------------------------------------
router.route("/getall").get((req, res) => {
   
    console.log("*** List all: ");
  
    // Check object
    objModel.find({ }, (err, users) => {
      if (err) {
          console.error('Error finding info:', err);
          return res.status(400).json({ error: 'Error' });
      } 
      else {
          if(users.length > 0){
            return res.status(200).json(users);
        }
          else{
              return res.status(400).json({ error: 'Data not found' });
          }
      }
    });
  
});

// ---------------------------------------------------------
// Add object
// ---------------------------------------------------------
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const tmdbId = req.body.tmdbId;
  const body = req.body.body;
  const rating = req.body.rating;

  // create a new object 
  const newObj = new objModel({
    userId,
    tmdbId,
    body,
    rating
  });

  console.log("*** Add review: " + userId + ", tmdbID:" + tmdbId);

    // save the new object
    newObj
    .save()
    .then((savedObj) => res.json(savedObj))
    .catch((err) => res.status(400).json("Error: " + err));

});

// ---------------------------------------------------------
// Get Review by movie Id
// ---------------------------------------------------------
router.route("/getreview").get((req, res) => {
    const userId = req.body.userId;
    const tmdbId = req.body.tmdbId;
    let body = "";
    let rating = "";
     
    console.log("*** Get Review: " + userId + ", tmdbId: " + tmdbId);
  
    // Check object
    objModel.find({ userId: userId, tmdbId: tmdbId }, (err, objs) => {
      if (err) {
          console.error('Error finding info:', err);
          return res.status(400).json({ error: 'Error' });
      } 
      else {
          if(objs.length > 0){
              return res.status(200).json(objs);
          }
          else{
              return res.status(400).json({ error: 'Data not found' });
          }
      }
    });
  
});


module.exports = router;
