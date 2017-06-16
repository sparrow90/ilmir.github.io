'use strict';

(function() {
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var allPictures;

  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.getElementById('picture-template');
  var picturesFragment = document.createDocumentFragment();

  function renderPictures(pictures) {
    picturesContainer.innerHTML = '';

    pictures.forEach(function(picture) {
      var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

      newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];
      newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];

      picturesFragment.appendChild(newPictureElement);

      if (picture['url']) {
        var photo = new Image();
        photo.src = picture['url'];

        var imageLoadTimeout = setTimeout(function() {
          newPictureElement.classList.add('pictures-failure');
        }, REQUEST_FAILURE_TIMEOUT);

        photo.onload = function() {
          var imgElement = document.createElement('img');
          imgElement.setAttribute('src', picture['url']);
          imgElement.setAttribute('width', 182);
          imgElement.setAttribute('height', 182);
          newPictureElement.replaceChild(imgElement, newPictureElement.querySelector('img'));
          clearTimeout(imageLoadTimeout);
        };

        photo.onerror = function() {
          newPictureElement.classList.add('pictures-failure');
        };
      }

      picturesContainer.appendChild(picturesFragment);
    });
  }

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  function loadPicturesData(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json', true);

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          picturesContainer.classList.add('pictures-loading');
          break;
        case ReadyState.DONE:
        default:
          if (xhr.status === 200) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove('pictures-loading');
            callback(JSON.parse(data));
            return;
          }

          if (xhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    };

    xhr.send();
  }

  function filterPictures(pictures, filterID) {
    var filteredPictures = pictures.slice(0);
    switch (filterID) {
      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        break;

      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;

      default:
        filteredPictures = pictures.slice(0);
        break;
    }

    return filteredPictures;
  }

  function setActiveFilter(filterID) {
    var filteredPictures = filterPictures(allPictures, filterID);
    renderPictures(filteredPictures);
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');
    for (var i = 0, l = filterElements.length; i < l; i++) {
      filterElements[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.id);
      };
    }
  }

  initFilters();

  loadPicturesData(function(loadedPictures) {
    allPictures = loadedPictures;
    setActiveFilter('filter-popular');
  });

  loadPicturesData(renderPictures);

  filters.classList.remove('hidden');
})();
