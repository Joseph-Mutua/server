exports.signup = (req, res) => {
  console.log("REQ BODY ON SIGNUP", req.body);

  res.json({
    data: "You hit the sigup endpoint",
  });
};
