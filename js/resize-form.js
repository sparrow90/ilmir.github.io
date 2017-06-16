'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  function validate() {
    var top = parseInt(resizeForm['resize-y'].value, 10);
    var left = parseInt(resizeForm['resize-x'].value, 10);
    var side = parseInt(resizeForm['resize-size'].value, 10);
    var photoWidth = previewImage.naturalWidth;
    var photoHeight = previewImage.naturalHeight;

    if (
      top >= 0 &&
      left >= 0 &&
      side >= 1 &&
      (top + side) <= photoHeight &&
      (left + side) <= photoWidth
    ) {
      return true;
    }
    return false;
  }

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if (!validate()) {
      return;
    }

    filterForm.elements['filter-image-src'] = previewImage.src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();
