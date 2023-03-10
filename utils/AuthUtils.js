function getTokenFromHeader(req) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      return token;
    }
    return null;
  }
  
  module.exports = { getTokenFromHeader };