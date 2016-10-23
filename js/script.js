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
var extension = '?client_id=' + client_id + '&client_secret=' + client_secret
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

function buildProjectHTML(name, url, description) {
	var content = ''
	content += '<a class=repo href=' + url + ' target=_blank>'
	content += '  <p class=name>'
	content +=      name
	content += '  </p>'
	content += '  <p class=description>'
	content +=      description
	content += '  </p>'
	content += '</a>'
	return content
}

function populateProjects(repos, pages) {
	if (!repos ) return

	var content = ''

	for (var i = 0; i < repos.length; i++) {
		var repo = repos[i]

		var name = repo.name.replace(/-/g, ' ').toUpperCase()
		var url = repo.html_url
		var desc = repo.description || 'no description available'

		if (repo.name.toLowerCase() === 'pepebecker.github.io') {
			name = 'THIS WEBSITE'
			desc = 'This repository contains the source code of this website'
		} else if (repo.has_pages) {
			const host = window.location.hostname
			if (host === 'localhost' || host === '127.0.0.1') {
				url = 'http://localhost/~Pepe/' + repo.name
			} else {
				url = '//' + host + '/' + repo.name
			}
		}

		content += buildProjectHTML(name, url, desc)
	}

	for (var i = 0; i < pages.length; i++) {
		content += buildProjectHTML(pages[i].name, pages[i].html_url, pages[i].description)
	}

	document.querySelector('#repos').innerHTML = content
}

(function () {
	xhr('GET', 'https://api.github.com/users/pepebecker', function (response) {
		if (response.status !== 404) {
			var data = JSON.parse(response.responseText)
			document.querySelector('#about').innerHTML = data.bio
		}
	})

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
