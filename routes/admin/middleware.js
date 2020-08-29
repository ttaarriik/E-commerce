const { validationResult } = require("express-validator");

module.exports = {
	handleErrors(templateFunc) {
    return async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
      	return res.render(templateFunc, { errors });
        }
        
      next();
    };
},
  
	requireAuth(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/signIn");
		
	}
}