const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // extract token from authorization header
    const token = req.headers["authorization"].split(" ")[1];
    // verify token
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        // handle token verification failure
        return res.status(200).send({
          message: "auth failed",
          success: false,
        });
      } else {
        // add user ID to request body and proceed to next middleware
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    // handle unexpected errors
    console.log(error);
    res.status(401).send({
      message: "auth failed",
      success: false,
    });
  }
};
