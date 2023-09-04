const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}
function isValidPhone(phone) {
  var regexpPhone = /^(01)[012][0-9]{8}$/;
  return regexpPhone.test(phone);
}

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(), 
  });
  try {
    if(!isValidEmail(req.body.email)) {
      res.status(500).json('Enter valid email please');
    }
    else if(!isValidPhone(req.body.phone) && (req.body.phone).length !== 11) {
      res.status(500).json('Enter valid phone number please');
    }
    else if((req.body.username).length < 3) {
      res.status(500).json('name length must be greater than or equal 3');
    } else {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser); 
    }
  } catch (err) {
    res.status(500).json(err);  
  }
}); 


//Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("Wrong UserName");
    }
      const hashedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
      ); 
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      const inputPassword = req.body.password;
      originalPassword != inputPassword && 
      res.status(401).json("Wrong Password");
      const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
        const { password, ...others } = user._doc;  
        res.status(200).json({...others, accessToken});
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;