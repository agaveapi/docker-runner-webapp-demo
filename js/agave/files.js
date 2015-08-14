var Files = {
  /*  Retrieves a directory listing on a system asynchronously.
   *  This is used populate the file browsing dialog in the
   * 	job submission form.
   */
  fetchListing: function(systemId, path)
  {
    var that = this;
    $('#directory-error').hide();
    $('#directory-content').hide();
    $('#directory-loading').show();

    var targetUrl = BASE_URL + '/files/v2/listings/';
    if (systemId) {
      targetUrl += "system/" + systemId + "/" + path;
    } else {
      targetUrl += path;
    }

    console.log("Fetching directory listing from " + targetUrl);

    $.ajax({
      type: "GET",
      url: targetUrl + "?pretty=true",
      dataType: "json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + Token.get());
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
      }
    })
    .done(function(msg) {

      // build a breadcrumb trail for quick access to the directory hierarchy.
      $('#directory-breadcrumb').empty();
      var pathElements = path.split("/");
      var breadcrumbPath = "";
      $('#directory-breadcrumb').append('<li><a href="/" class="trop-dir">ROOT</a></li>');
      $.each(pathElements, function(index, pathElement) {
        if (breadcrumbPath == '') {
          breadcrumbPath = pathElement;
        } else {
          breadcrumbPath += '/' + pathElement;
        }

        $('#directory-breadcrumb').append('<li><a href="' + breadcrumbPath + '" class="trop-dir">' + pathElement + '</a></li>');
      });

      // mark the last child as the current active directory
      $('#directory-breadcrumb li:last-child').addClass('active');

      $('#directory-listing tbody').empty();

      $('#directory-listing tbody').append('<tr><td class="col-md-6"><a src="' + $('#directory-breadcrumb li:last-child a').attr("href") + '" class="trop-dir"><span class="glyphicon glyphicon-folder-close"></span>  ..</a></td><td class="col-md-3">&nbsp;</td><td class="col-md-3">&nbsp;</td></tr>');
      $.each(msg.result, function(index, fileItem) {
        if (fileItem.name != '.')
        {
          // display them in the popup
          if (fileItem.format == "folder") {
            $('#directory-listing tbody').append('<tr><td class="col-md-6"><a src="' + fileItem.path + '" class="trop-dir"><span class="glyphicon glyphicon-folder-close"></span>  ' + fileItem.name + '</a></td><td class="col-md-3">&nbsp;</td><td class="col-md-3">' + shortFormatDate(fileItem.lastModified) + '</td></tr>');
          }
          else {
            $('#directory-listing tbody').append('<tr><td class="col-md-6"><a src="' + fileItem.path + '" class="trop-file"><span class="glyphicon glyphicon-file"></span>  ' + fileItem.name + '</a></td><td class="col-md-3">'+humanFileSize(fileItem.length, true)+'</td><td class="col-md-3">' + shortFormatDate(fileItem.lastModified) + '</td></tr>');
          }
        }
      });

      $('#directory-listing a.trop-dir, #directory-breadcrumb a.trop-dir').click(function(e) {
        e.preventDefault();
        that.fetchListing(systemId, $(this).attr('src'));
      });

      $('.use-me').click(function(e) {
        e.preventDefault();
        $("#inputtext").val(path);
        $("#close-me").click();
      });

      $('a.trop-file').click(function(e) {
        e.preventDefault();
        $("#inputtext").val("agave://" + systemId + "/" + $(this).attr('src'));
        $("#close-me").click();
      });

      $('#directory-loading').hide();
      $('#directory-content').show();

    })
    .fail(function(msg) {
      $('#directory-loading').hide();
      $('#directory-content').hide();
      $('#directory-error').show();
      if (msg && msg.message)
        $('#directory-error').html('<div class="panel panel-danger"><p class="panel-heading">' + msg.message + '</div><div class="panel-body"><div class="btn-group"><button id="dir-back" type="button" class="btn btn-primary">Back</button><button id="dir-reload" type="button" class="btn btn-default"><span class="glyphicon glyphicon-refresh form-control-feedback"></span>Reload</button></div></div></div>');
      else
        $('#directory-error').html('<div class="panel panel-danger"><div class="panel-heading">Failed to load content due to unknown issue.</div><div class="panel-body"><div class="btn-group"><button id="dir-back" type="button" class="btn btn-primary">Back</button><button id="dir-reload" type="button" class="btn btn-default"><span class="glyphicon glyphicon-refresh form-control-feedback"></span>Reload</button></div></div></div>');

      $('#dir-reload').click(function(e) {
        e.preventDefault();
        that.fetchListing(systemId, path);
      });
      $('#dir-back').click(function(e) {
        e.preventDefault();
        var orignalPath = "";
        if (system != null && system.public) {
          orignalPath = Profile.get().username;
        }
        that.fetchListing(systemId, orignalPath);
      });
    });
  }

};
