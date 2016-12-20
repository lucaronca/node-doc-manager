// jQuery
const $ = require('jquery');
global.jQuery = $;

// Foundation
require('foundation-sites/js/foundation.core');
require('foundation-sites/js/foundation.util.mediaQuery');
require('foundation-sites/js/foundation.abide');

//Foundation icons
require('foundation-icons/foundation-icons.scss');

// App styles
require('./styles.scss');

$(document).ready(function() {

  $(this).foundation();

  var form = $("#upload-form");

  $('.upload-btn').on('click', function() {
    form.foundation('validateForm');
  });

  $(this)
    .bind('invalid.zf.abide', function(ev, elem) {
      $(elem).parents('fieldset').find('.form-error').show();
    })
    .bind('valid.zf.abide', function(ev, elem) {
      $(elem).parents('fieldset').find('.form-error').hide();
    });

  // stop default form submit and handle it with zf adibe
  form
    .bind('submit', function(e) {
      e.preventDefault();
      console.log('submit intercepted');
      return false;
    })
    .bind('forminvalid.zf.abide', function(e,elem) {
      console.log('form is invalid');
    })
    .bind('formvalid.zf.abide', function(e,elem) {
      $('#upload-input').click();
      $('label[for="progress"]').text('0%');
      $('.progress .meter').width('0%'); 
    });

  $('#upload-input').on('change', function(){

    var files = $(this)[0].files;

    if (files.length > 0){
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();

      // loop through all the selected files and add them to the formData object
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // add the files to formData object for the data payload
        formData.append('uploads', file, file.name);

        // adding other fields to formData
        formData.append('title', $('.title input').val());
        formData.append('month', $('.month select').val());
        formData.append('year', $('.year input').val());
        formData.append('description', $('.description textarea').val());

      }

      $.ajax({
        url: '/upload/send',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the progress bar with the new percentage
              $('label[for="progress"]').text(percentComplete + '%');
              $('.progress .meter').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('label[for="progress"]').html('Done');
              }

            }

          }, false);

          return xhr;
        }
      });

    }
  });
  
});
