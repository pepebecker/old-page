var xhr = function (method, url, callback, async = true) {
	var xhr = new XMLHttpRequest()
	xhr.open(method, url, async)
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

function showRepos (repos) {
	repos = JSON.parse(repos)

	if (repos === null) {
		return;
	}

	var content = ''

	var modimes = {
		name: 'Mo Dimes Music',
		description: 'Mo Dimes Music Official Website',
		html_url: 'http://modimesmusic.com/'
	}
	repos.push(modimes)

	var ibreed = {
		name: 'iBreed Dogs',
		description: 'iBreed puts your Kennel in your pocket<br>Available on the App Store',
		html_url: 'https://itunes.apple.com/us/app/ibreed-dogs/id1046382842?ls=1&mt=8'
	}
	repos.push(ibreed)

	for (var i = 0; i < repos.length; i++) {
		var name, url, description

		name = repos[i].name.replace('-', ' ').toUpperCase()
		// url = repos[i].html_url
		url = 'http://pepebecker.com/' + repos[i].name

		xhr('HEAD', url, function (response) {
			if (response.status === 404) {
				url = repos[i].html_url
			}
		}, false)

		if (repos[i].description !== null && repos[i].description.length > 0) {
			description = repos[i].description
		} else {
			description = 'no description available'
		}

		if (repos[i].name === 'pepebecker.github.io') {
			name = 'THIS WEBSITE'
			description = 'This repository contains the source code of this website'
		}

		if (repos[i].name === 'iBreed Dogs') {
			name = 'iBREED DOGS'
		}

		content += '<a class=repo href=' + url + ' target=_blank>'
		content += '  <p class=name>'
		content +=      name
		content += '  </p>'
		content += '  <p class=description>'
		content +=      description
		content += '  </p>'
		content += '</a>'
	}
	return document.getElementById("repos").innerHTML = content
}

(function () {
	showRepos(localStorage.getItem('repos'))
	checkIfUpToDate(function (up2date) {
		if (up2date) {
			console.log('Everything is up to date')
			var repos = localStorage.getItem('repos')
			showRepos(repos)
		} else {
			console.log('Requesting repos from server')
			getRepos(function (repos) {
				if (JSON.parse(repos)) {
					localStorage.setItem('repos', repos)
					showRepos(repos)
				}
			})
		}
	})
})()
