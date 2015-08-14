(function($) {

  $('#startTutorial').click(function(e) {
    var tour = new Tour({
      debug: true,
      steps: [
        {
          element: "#signin",
          placement: "bottom",
          title: "Login to Agave",
          content: "Login so you can access your apps and data."
        },
        {
          element: "#jobname",
          placement: "right",
          title: "Give your job a name",
          content: "Select a name for your job. This can be any alphanumeric value."
        },
        {
          element: "#image",
          placement: "right",
          title: "Select a Docker image",
          content: "Select the Docker image you wish to run. This could be wired up to the <a href=\"https://hub.docker.com\" target=\"_blank\">Docker Central Registry</a>, but we've hand picked a few images for general consumption to keep things simple."
        },
        {
          element: "#commandParameters",
          placement: "right",
          title: "Define how to start the container",
          content: "Enter the command and any arguments you would like to use to run the container. This can be just about anything."
        },
        {
          element: "#inputFileTabs li.active",
          placement: "top",
          title: "Select your data",
          content: "Some containers are self-contained. Others are simple executable environments for you to run arbitrary code. If you would like Agave to stage any code, datasets, config files, etc onto the execution system and make them available to your container as a mounted volume (<span class=\"code\">/data</span>), enter them here."
        },
        {
          element: "#job-submit",
          placement: "right",
          title: "Submit your job",
          content: "Press sumbit to run your container. This may take just a moment depending on the responsiveness of your execution and storage systems."
        },
        {
          element: "#job-panel",
          placement: "left",
          title: "Track your job",
          content: "Use the job monitoring panel to track the progress of your job. Depending on the load on your system and amount of data being moved, this could take several mintues."
        }
      ]
    });

    // Initialize the tour
    tour.init();

    tour.restart();
  });
})(jQuery);

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

(function() {
    $("#upload_field").html5_upload({
        url: function(number) {
            return prompt(number + " url", "/");
        },
        sendBoundary: window.FormData || $.browser.mozilla,
        onStart: function(event, total) {
            return true;
            return confirm("You are trying to upload " + total + " files. Are you sure?");
        },
        onProgress: function(event, progress, name, number, total) {
            console.log(progress, number);
        },
        setName: function(text) {
            $("#progress_report_name").text(text);
        },
        setStatus: function(text) {
            $("#progress_report_status").text(text);
        },
        setProgress: function(val) {
            $("#progress_report_bar").css('width', Math.ceil(val * 100) + "%");
        },
        onFinishOne: function(event, response, name, number, total) {
        //alert(response);
        },
        onError: function(event, name, error) {
            alert('error while uploading file ' + name);
        }
    });
});


function shortFormatDate(tdate) {
    var system_date = moment(tdate.replace(".000",""));
    var user_date = moment();

    if (moment(0, "HH").diff(system_date) <= 0) {
      return system_date.format("h:mmA");
    } else {
      return system_date.format("MMM DD, YYYY");
    }
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};
