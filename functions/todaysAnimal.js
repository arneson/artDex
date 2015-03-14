var todaysAnimal;

function refreshTodaysAnimal(req,res){
	if(req.user.lastUpdatedAnimal !== Date.now()){

		//temp
		req.user.location = {x:0,y:0};
		var newAnimal  = null;

	}
}

module.exports = todaysAnimal;