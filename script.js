var repos = '';
var etag = localStorage.getItem('etag');

var account = 'pepebecker';

var request = {
	url          : `https://api.github.com/users/${account}/repos`,
	method       : 'HEAD'
}

minixhr(request, function (data, response, xhr, header) {
	console.log(header);
	if (etag !== header.Etag || localStorage.getItem('repos').length === 0) {
		localStorage.setItem('etag', header.Etag);
		fetchRepos();
	} else {
		repos = JSON.parse(localStorage.getItem('repos'));
		showRepos();
	}
});

function fetchRepos() {
	minixhr(`https://api.github.com/users/${account}/repos`, function (data, response, xhr, header) {
		localStorage.setItem('repos', data, null, 4);
		repos = JSON.parse(data);
		showRepos();
	})
}

function showRepos() {
	var content = '';

	content += '<p>My GitHub Reposetories</p>\n';

	for (var i = 0; i < repos.length; i++) {
		var name = repos[i].name;
		var url = repos[i].html_url;
		var description = (repos[i].description.length>0)?repos[i].description:'no description available';

		if (repos[i].name === `${account}.github.io`)
			description = 'This repo contains the source of this site';

		content += `<li class="repo"><a href="${url}">${name}</a><p class="discription">${description}</p></li>\n`;
	}

	document.getElementById("repos").innerHTML = content;
}
