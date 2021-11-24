const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (user) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "30m" }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
                `,
    };

    const sentMail = await sgMail.send(emailData);
    console.log("SIGNUP EMAIL SENT", sentMail);

    return res.json({
      message: `Email has been sent to ${email}. Follow the instructions to activate your account`,
    });
  } catch (err) {
    console.log("SIGNUP EMAIL SENT ERROR", err);
    return res.json({
      message: err.message,
    });
  }
};

exports.accountActivation = async (req, res) => {
  const { token } = req.body;

  try {
    if (token) {
      const decodedToken = await jwt.verify(
        token,
        process.env.JWT_ACCOUNT_ACTIVATION
      );

      if (!decodedToken) {
        return res.status(401).json({
          error: "Expired link. Sign up again",
        });
      }

      const { name, email, password } = jwt.decode(token);

      const user = new User({ name, email, password });

      const newUser = await user.save();

      if (!newUser) {
        console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
        return res.status(401).json({
          error: "Error saving user in database. Try Signing up again",
        });
      }

      return res.json({
        message: "Signup success. Please sign in",
      });
    }
  } catch (err) {
    console.log("ACCOUNT ACTIVATION ERROR", err);
    return res.json({
      error: "Expired link. Sign up again",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(400).json({
        error: "User with that Email does not exist. Please sign up",
      });
    }

    //authenticate the password
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and Password do not match",
      });
    }

    //Generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  } catch (err) {
    console.log("SIGNIN ERROR", err);
    return res.json({
      error: err,
    });
  }
};
