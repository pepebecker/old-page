var xhr = function (method, url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open(method, url, true)
  xhr.onreadystatechange = function() {
    if (this.readyState === this.DONE) {
      if (this.status !== 404) {
        callback(this)
      }
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
    if (response.getResponseHeader('etag') === localStorage.getItem('etag')) {
      callback(true)
    } else {
      localStorage.setItem('etag', response.getResponseHeader('etag'))
      callback(false)
    }
  })
}

function getRepos (callback) {
  xhr('GET', url, function (response) {
    callback(response.responseText)
  })
}

function showRepos (repos) {
  repos = JSON.parse(repos)
  var content = ''
  // content += '<p>My GitHub Reposetories</p>';
  for (var i = 0; i < repos.length; i++) {
    var name = repos[i].name.replace('-', ' ')
    var url = repos[i].html_url
    var description = 'no description available'
    if (repos[i].description !== null) {
      if (repos[i].name === 'pepebecker.github.io') {
        continue
      }
      if (repos[i].description.length > 0) {
        description = repos[i].description
      } else {
        description = 'no description available'
      }
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
        localStorage.setItem('repos', repos)
        showRepos(repos)
      })
    }
  })
})()
