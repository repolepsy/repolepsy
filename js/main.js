// auth user

var octo = new Octokat({
	token: "0f7669b10b651e486ed6a848e6741b9e8c1a37c7"
});


//get user's repos

var REPOS_PER_PAGE = 10; //can be safely changed to 100
var data = {
	repos: []
}

function getAllRepos(res) {
	console.warn("page", data.repos.length);
	res.forEach(function(repo) {
		console.log("..", repo);
	});
	data.repos = data.repos.concat(res);

	if (res.nextPage) {
		res.nextPage().then(getAllRepos);
	}
	else {
		var dataJSON = JSON.stringify(data);
		console.warn("finished", dataJSON);
		console.log("size", dataJSON.length / 1024, "KB");
	}
}

var fetch = octo.user.repos.fetch({per_page: REPOS_PER_PAGE})
fetch.then(getAllRepos);