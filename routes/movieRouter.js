const router = require("express").Router();
const objModel = require("../models/tmdbMovieModel");
const axios = require("axios");
require('dotenv').config();

// ---------------------------------------------------------
// Get movies from tmdb
// ---------------------------------------------------------
router.route("/getfromtmdb").get((req, res) => {
   
    console.log("*** Get from TMDB: ");

    const tmdbMovieListURI = process.env.TMDBMovieListURI;

    const objList = axios  (tmdbMovieListURI);
 
    console.log(objList);
    
    // // Check object
    // objModel.find({ }, (err, users) => {
    //   if (err) {
    //       console.error('Error finding info:', err);
    //       return res.status(400).json({ error: 'Error' });
    //   } 
    //   else {
    //       if(users.length > 0){
    //         return res.status(200).json(users);
    //     }
    //       else{
    //           return res.status(400).json({ error: 'Data not found' });
    //       }
    //   }
    // });
  
});

router.get('/get-from-tmdb-to-local', async (req, res) => {
    try {
      const tmdbMovieListURI = process.env.TMDBMovieListURI;

      // Fetch data from the API using axios
      const response = await axios.get(tmdbMovieListURI);
      const apiData = response.data.results;
  
      await objModel.deleteMany({});

      // Save the fetched data to MongoDB using Mongoose
      const savedData = await objModel.create(apiData);
  
      res.json(savedData);
    } catch (error) {
      console.error('Error fetching data from the API and saving to MongoDB:', error);
      res.status(500).json({ error: 'Failed to fetch and save data' });
    }
  });

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
// Login : Get object
// ---------------------------------------------------------
router.route("/login").get((req, res) => {
    const userId = req.body.userId;
    const password = req.body.password;
   
    console.log("*** Login: " + userId);
  
    // Check object
    objModel.find({ userId: userId }, (err, users) => {
      if (err) {
          console.error('Error finding info:', err);
          return res.status(400).json({ error: 'Error' });
      } 
      else {
          if(users.length > 0){
            const authenticated = bcryptjs.compareSync(password, users[0].password);
            if (authenticated){
                return res.status(200).json(users);
            }
            else{
                return res.status(400).json({error: 'password error'});
            }
          }
          else{
              return res.status(400).json({ error: 'User not found' });
          }
      }
    });
  
});

// ---------------------------------------------------------
// Update object
// ---------------------------------------------------------
router.route("/update").post((req, res) => {
    const userId = req.body.userId;
    const password = req.body.password;
   
    console.log("*** Update: " + userId);
  
    // Check object
    objModel.findOne({ userId: userId }, (err, obj) => {
      if (err) {
          console.error('Error finding info:', err);
          return res.status(400).json({ error: 'Error' });
      } 
      else {
          if(obj != null && obj.userId.length > 0){

                obj.password = bcryptjs.hashSync(password,10);
                obj.save();
                return res.status(200).json(obj);
          }
          else{
              return res.status(400).json({ error: 'User not found' });
          }
      }
    });
});

module.exports = router;
