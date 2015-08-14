var Jobs = {
  _watch: null,
  submit: function(jobJson)
  {
    $('#jobResponseModalLabel').html("Submitting job...");
    $('#job-error').hide();
    $('#job-content').hide();
    $('#job-loading').show();

    $('#jobResponseModal').modal({
      show:true
    });

    var that = this;
    $.ajax({
      type: "POST",
      url: BASE_URL + "/jobs/v2/?pretty=true",
      data: JSON.stringify(jobJson),
      dataType: "json",
      beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + Token.get());
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.setRequestHeader('Content-Type', 'application/json');
      }
    })
    .done(function(msg) {
      console.log("Successfully submitted job " + msg.result.id + " for submission.");
      $('#job-error').hide();
      $('#job-content').html('<h4>Successfully submitted simulation!</h4><p>Your simulation was accepted and given ID '+msg.result.id+'. You can follow the progress of your simulation in real time from the Simulation Status panel on the right.</p>');
      $('#job-loading').hide();
      $('#job-content').show();


      that.fetchAll();
    })
    .fail(function(msg) {
      console.log(msg.message);

      if (msg && msg.message)
        $('#job-error').html('<div class="panel panel-danger"><div class="panel-heading"><h3 class="panel-title">Failed to submit job</h3></div><div class="panel-body">' + msg.message + '<br/><button id="job-close" type="button" class="btn btn-default"><span class="glyphicon glyphicon-close form-control-feedback"></span>Close</button></div></div>');
      else
        $('#job-error').html('<div class="panel panel-danger text-center"><div class="panel-heading"><h3 class="panel-title">Failed to submit job</h3></div><div class="panel-body">Failed to submit job due to unknown issue.<br/><button id="job-close" type="button" class="btn btn-default"><span class="glyphicon glyphicon-close form-control-feedback"></span>Close</button></div></div>');

      $('#job-content').hide();
      $('#job-loading').hide();
      $('#job-error').show();
      $('#job-close').click(function(e) {
        $('#jobResponseModal').modal({show:false});
      });
      // $('#response-modal .modal-body').html(msg.message);
      // $('#response-modal').modal({show:true});
    });
  },

  fetchAll: function()
  {
    var that = this;
    $.ajax({
        type: "GET",
        url: BASE_URL + "/jobs/v2/?pretty=true",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Token.get());
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    })
    .done(function(msg) {
      console.log("Successfully fetched all jobs.");
      that.setAll(msg.result);
      $('.jobs-container table tbody').empty();
      $.each(msg.result, function(index, job){
        var category = that.getStatusCategory(job.status);
        var jobItem = $('<tr class="' + category + '"><td><span class="badge pull-right">'+job.status+'</span><h4>'+job.name + '</h4></td></tr>');

        if (category == 'failure' || category == 'success') {
            $('#jobs-all tbody, #jobs-completed tbody, #jobs-' + category + ' tbody' ).append(jobItem);
        } else {
            $('#jobs-all tbody, #jobs-' + category + " tbody").append(jobItem);
        }
      });
    })
    .fail(function(msg) {
      console.log(msg.message);
    });
  },

  getStatusCategory: function(jobStatus)
  {
      if (jobStatus == 'PENDING')
        return 'info';
    	else if (jobStatus == 'PROCESSING_INPUTS')
        return 'info';
      else if (jobStatus == 'STAGING_INPUTS')
        return 'info';
    	else if (jobStatus == 'STAGING_JOB')
        return 'info';
      else if (jobStatus == 'STAGED' )
        return 'info';
      else if (jobStatus == 'SUBMITTING')
        return 'info';

      else if (jobStatus == 'QUEUED')
       return 'active';

      else if (jobStatus == 'CLEANING_UP')
        return 'success';
      else if (jobStatus == 'ARCHIVING')
        return 'success';
      else if (jobStatus == 'ARCHIVING_FINISHED')
        return 'success';
      else if (jobStatus == 'RUNNING')
        return 'success';
      else if (jobStatus == 'PAUSED')
        return 'success';

      else if (jobStatus == 'STOPPED')
        return 'warning';
      else if (jobStatus == 'KILLED')
        return 'warning';

      else if (jobStatus == 'ARCHIVING_FAILED')
        return 'danger';
      else if (jobStatus == 'FAILED')
        return 'danger';

      else if (jobStatus == 'FINISHED')
        return '';
      else
        return '';

  },

  fetchDetails: function(jobId)
  {
    var jobDescription = null;
    $.ajax({
      type: "GET",
      url: BASE_URL + "/jobs/v2/" + jobId + "/?pretty=true",
      data: JSON.stringify(jobJson),
      dataType: "json",
      async: false,
      beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + Token.get());
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.setRequestHeader('Content-Type', 'application/json');
      }
    })
    .done(function(msg) {
      console.log("Successfully fetched job " + jobId + " details");
      console.log(msg.result);
      jobDescription = msg.result;
    })
    .fail(function(msg) {
      console.log("Failed to fetched job " + jobId + " details");
        // alert(msg.message);
        // $('#response-modal .modal-body').html(msg.message);
        // $('#response-modal').modal({show:true});
    });
    return jobDescription;
  },

  fetchHistory: function(jobId)
  {
    var jobHistory = null;
    $.ajax({
        type: "GET",
        url: BASE_URL + "/jobs/v2/" + jobId + "/history?pretty=true",
        data: JSON.stringify(jobJson),
        dataType: "json",
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Token.get());
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    })
    .done(function(msg) {
      console.log("Successfully fetched job " + jobId + " history");
      console.log(msg.result);
      jobHistory = msg.result;
    })
    .fail(function(msg) {
      console.log("Failed to fetched job " + jobId + " history");
        // alert(msg.message);
        // $('#response-modal .modal-body').html(msg.message);
        // $('#response-modal').modal({show:true});
    });
    return jobHistory;
  },

  fetchStatus: function(jobId)
  {
    var jobStatus = null;
    $.ajax({
        type: "GET",
        url: BASE_URL + "/jobs/v2/" + jobId + "/status/?pretty=true",
        data: JSON.stringify(jobJson),
        dataType: "json",
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Token.get());
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    })
    .done(function(msg) {
        console.log("Successfully fetched job " + jobId + " status");
        console.log(msg.result);
        jobStatus = msg.result.status;
    })
    .fail(function(msg) {
      console.log("Failed to fetched job " + jobId + " status");
        // alert(msg.message);
        // $('#response-modal .modal-body').html(msg.message);
        // $('#response-modal').modal({show:true});
    });
    return jobStatus;
  },

  // startWatch: function(jobId)
  // {
  //   if (Token.isValid()) {
  //     var that = this;
  //     this._watch[jobId] = setInterval(function() {
  //       console.log("Checking status of job " + jobId);
  //
  //       var jobStatus = this.fetchStatus(jobId);
  //
  //       if (jobStatus == null) {
  //         alert("Failed to retrieve status of job " + jobId);
  //       } else {
  //         $('#displaystatus').val(jobStatus);
  //         if (jobStatus == 'FINISHED' || jobStatus == 'FAILED') {
  //           that.stopWatch(jobId);
  //         }
  //       }
  //     }, 100000);
  //   }
  // },
  //
  // stopWatch: function(jobId)
  // {
  //   clearInterval(this._watch[jobId]);
  //   this._watch.splice(jobId, 1);
  // },

  startWatch: function(jobId)
  {
    if (Token.isValid()) {
      var that = this;
      this._watch = setInterval(function() {
        console.log("Checking job statuses");

        that.fetchAll();

      }, 30000);
      this.fetchAll();
    }
  },

  stopWatch: function(jobId)
  {
    clearInterval(this._watch);
  },

  setAll: function(jobs)
  {
    var indexedJobs = new Object();
    $.each(jobs,function(index, job) {
      indexedJobs[job.id] = job;
    });
    localStorage.setItem('agaveJobs', JSON.stringify(indexedJobs));
  },

  set: function(job)
  {
    var jobs = this.getAll();
    if (jobs == null) {
      jobs = Object();
      jobs[job.id] = job;
    } else {
      jobs[job.id] = job;
    }

    this.setAll(jobs);
  }
};
