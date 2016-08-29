var xhr = function (method, url, callback) {
	var xhr = new XMLHttpRequest()
	xhr.open(method, url, true)
	xhr.onreadystatechange = function() {
		if (this.readyState === this.DONE) {
			callback(this)
		}
	}
	xhr.send()
}

var domain = 'https://api.github.com/users/pepebecker/repos'
var client_id = 'a5bd048689d32854df86'
var client_secret = '1c1d268c1f65b2322b1c6be1760d606c52b654a9'
var url = domain + '?client_id=' + client_id + '&client_secret=' + client_secret

function checkIfUpToDate (callback) {
	xhr('HEAD', url, function (response) {
		if (response.status !== 404) {
			if (response.getResponseHeader('etag') === localStorage.getItem('etag') && localStorage.getItem('repos').length > 0) {
				callback(true)
			} else {
				localStorage.setItem('etag', response.getResponseHeader('etag'))
				callback(false)
			}
		}
	})
}

function getRepos (callback) {
	xhr('GET', url, function (response) {
		if (response.status !== 404) {
			callback(response.responseText)
		}
	})
}

function buildRepo(name, html_url, description) {
	var content = ''
	content += '<a class=repo href=' + html_url + ' target=_blank>'
	content += '  <p class=name>'
	content +=      name
	content += '  </p>'
	content += '  <p class=description>'
	content +=      description
	content += '  </p>'
	content += '</a>'
	return content
}

function showRepos (repos, pages) {
	repos = JSON.parse(repos)

	if (!repos) return

	var content = ''

	for (var i = 0; i < repos.length; i++) {
		var repo = repos[i]

		for (var j = 0; j < pages.length; j++) {
			if (pages[j].key === repo.name) {
				Object.assign(repo, pages[j])
				continue
			}
		}

		repo.name = repo.name.replace('-', ' ').toUpperCase()
		repo.description = repo.description || 'no description available'

		content += buildRepo(repo.name, repo.html_url, repo.description)
	}

	for (var i = 0; i < pages.length; i++) {
		if (!pages[i].key) {
			content += buildRepo(pages[i].name, pages[i].html_url, pages[i].description)
		}
	}

	return document.querySelector("#repos").innerHTML = content
}

(function () {
	xhr('GET', 'json/pages.json', function (response) {
		var pages = JSON.parse(response.responseText)
		if (response.status !== 404) {
			showRepos(localStorage.getItem('repos'), pages)
			checkIfUpToDate(function (up2date) {
				if (up2date) {
					console.log('Everything is up to date')
					var repos = localStorage.getItem('repos')
					showRepos(repos, pages)
				} else {
					console.log('Requesting repos from server')
					getRepos(function (repos) {
						if (JSON.parse(repos)) {
							localStorage.setItem('repos', repos)
							showRepos(repos, pages)
						}
					})
				}
			})
		}
	})
})()
