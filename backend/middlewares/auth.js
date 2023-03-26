/**
 * Determine if the user authenticated by verifying authorization token header
 */
const jwt = require("jsonwebtoken");
const TokenController = require("../controllers/token-controller");

module.exports = async (req, res, next) => {
  //1- Get authorization token from header
  const authHeader = req.get("Authorization");
  if (authHeader) {
    let decodedToken;
    try {
      decodedToken = jwt.verify(authHeader, process.env.SECRET_KEY);

      if (decodedToken) {
        console.log("Decoded Token: ", decodedToken);
        //Injection
        req.userId = decodedToken.id;
        req.tokenId = decodedToken.tokenId;

        const accessToken = await TokenController.getAccessToken(req.tokenId);
        if (!accessToken.revoked && accessToken.expiresIn >= Date.now()) {
          next();
        }else{
          return res.status(401).json({ status: false, message: "Token revoked" });
        }
      }else{
        return res.status(401).json({ status: false, message: "Error in decoding" });
      }
    } catch (error) {
      console.log("Error: ", error)
      return res
        .status(401)
        .json({ status: false, message: "Failed to verify token" });
    }
  }else{
    return res.status(401).json({ status: false, message: "Unauthenticated request" });
  }
};