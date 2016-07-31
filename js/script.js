var xhr = (method, url, callback) => {
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

var checkIfUpToDate = (callback) => {
  xhr('HEAD', 'https://api.github.com/users/pepebecker/repos', (response) => {
    if (response.getResponseHeader('etag') === localStorage.getItem('etag')) {
      callback(true)
    } else {
      callback(false)
    }
  })
}

var getRepos = (callback) => {
  xhr('GET', 'https://api.github.com/users/pepebecker/repos', (response) => {
    callback(response.responseText)
  })
}

var showRepos = (repos) => {
  repos = JSON.parse(repos)
  var content = '<p>My GitHub Reposetories</p>\n';
  for (var i = 0; i < repos.length; i++) {
    var name = repos[i].name;
    var url = repos[i].html_url;
    var description = 'no description available';
    if (repos[i].description !== null) {
      if (repos[i].description.length > 0) {
        description = repos[i].description;
      } else {
        description = 'no description available';
      }
    }
    if (repos[i].name === ('pepebecker.github.io')) {
      description = 'This repo contains the source of this site';
    }
    content += "<li class='repo'><a href='" + url + "'>" + name + "</a><p class='discription'>" + description + "</p></li>\n";
  }
  return document.getElementById("repos").innerHTML = content;
}

(() => {
  checkIfUpToDate((up2date) => {
    if (up2date) {
      console.log('Everything is up to date')
      var repos = localStorage.getItem('repos')
      showRepos(repos)
    } else {
      console.log('Requesting repos from server')
      getRepos((repos) => {
        localStorage.setItem('repos', repos, null, 4)
        showRepos(repos)
      })
    }
  })
})()
