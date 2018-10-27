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
var extension = '?client_id=' + client_id + '&client_secret=' + client_secret + '&per_page=1000'
var url = domain + extension

function checkIfUpToDate (callback) {
	xhr('HEAD', url, function (response) {
		if (response.status !== 404) {
			if (response.getResponseHeader('etag') === localStorage.getItem('etag') && localStorage.getItem('repos')) {
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
			callback(JSON.parse(response.responseText))
		}
	})
}

function getPages (callback) {
	xhr('GET', 'json/pages.json', function (response) {
		if (response.status !== 404) {
			callback(JSON.parse(response.responseText))
		}
	})
}

function createRepoElement(name, url, description) {
	var repoElement = document.createElement('a')
	repoElement.classList.add('repo')
	repoElement.setAttribute('href', url)
	repoElement.setAttribute('target', '_blank')

	var nameElement = document.createElement('p')
	nameElement.classList.add('name')
	nameElement.appendChild(document.createTextNode(name))
	repoElement.appendChild(nameElement)

	var descriptionElement = document.createElement('p')
	descriptionElement.classList.add('description')
	descriptionElement.appendChild(document.createTextNode(description))
	repoElement.appendChild(descriptionElement)

	return repoElement
}

function populateProjects(repos, pages) {
	if (!repos ) return

	var reposElement = document.querySelector('#repos')

	for (var i = 0; i < repos.length; i++) {
		var repo = repos[i]

		if (repo.name.toLowerCase() === 'pepebecker.github.io') {
			continue
		}

		var name = repo.name.replace(/-/g, ' ').toUpperCase()
		var url = repo.html_url
		var desc = repo.description || 'no description available'

		if (repo.homepage) {
			url = repo.homepage
		}

		reposElement.appendChild(createRepoElement(name, url, desc))
	}

	for (var i = 0; i < pages.length; i++) {
		reposElement.appendChild(createRepoElement(pages[i].name, pages[i].html_url, pages[i].description))
	}
}

(function () {
	getPages(function (pages) {
		var repos = JSON.parse(localStorage.getItem('repos'))
		populateProjects(repos, pages)
		checkIfUpToDate(function (up2date) {
			if (!up2date) {
				console.log('Requesting repos from server')
				getRepos(function (repos) {
					localStorage.setItem('repos', JSON.stringify(repos))
					populateProjects(repos, pages)
				})
			}
		})
	})
})()
