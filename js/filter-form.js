'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = filterForm.querySelector('.filter-image-preview');
  var prevButton = filterForm['filter-prev'];
  var selectedFilter = filterForm['upload-filter'];

  var filterMap;

  var today = new Date().getTime();
  var myBirthday = new Date();
  myBirthday.setMonth(8);
  myBirthday.setDate(13);
  if (new Date() < myBirthday) {
    myBirthday.setFullYear(myBirthday.getFullYear() - 1);
  }
  var daysSinceBirthday = today - myBirthday.getTime();
  var cookiesEnd = new Date(today + daysSinceBirthday);

  function setFilter() {
    if (!filterMap) {
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
    docCookies.setItem('selected-filter', selectedFilter.value, cookiesEnd);
  }

  for (var i = 0, l = selectedFilter.length; i < l; i++) {
    selectedFilter[i].onchange = function() {
      setFilter();
    };
  }

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    filterForm.reset();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    uploadForm.classList.remove('invisible');
    filterForm.classList.add('invisible');
  };

  selectedFilter.value = docCookies.getItem('selected-filter');
  setFilter();
})();
