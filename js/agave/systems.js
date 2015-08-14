var Systems = {

  /* Retrieve the user's public and private systems from Agave.
     This is called once at page login and/or page load and cached
     locally.
  */
  fetchAll: function()
  {
    var that = this;
    $.ajax({
        type: "GET",
        url: BASE_URL + "/systems/v2/?pretty=true",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Token.get());
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    })
    .done(function(msg) {
        console.log("Successfully retrieved user systems ");
        //$('.data-system-list').empty();
        $.each(msg.result, function(index, system) {
          var sysClass = system.type == "STORAGE" ? 'system-storage ' : 'system-exe ';

          if (system.public && system.default) {
            sysClass += 'active'
          }

          $('.data-system-list').append('<li><a href="#" ref="' + system.id + '" class="' + sysClass + '">' + system.name + '</a></li>');
        });
        that.setAll(msg.result);
        $('.data-system-list li a').click(function(e) {
          e.preventDefault();
          $('.data-system-list li a.active').removeClass('active');
          $(this).addClass('active');
        });
    })
    .fail(function(msg) {
        that.clearAll();
    });
  },

  fetchDetails: function(systemId)
  {
    var that = this;
    $.ajax({
        type: "GET",
        url: BASE_URL + "/systems/v2/"+ systemId + "?pretty=true",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Token.get());
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    })
    .done(function(msg) {
        console.log("Successfully retrieved user system " + systemId);
        that.set(msg.result);
    })
    .fail(function(msg) {
      that.clear(systemId);
    });
  },

  clearAll: function()
  {
    localStorage.removeItem('agaveSystems');
  },

  clear: function(systemId)
  {
    var systems = this.getAll();
    delete systems[systemId];
    this.setAll(systems);
  },

  setAll: function(systems)
  {
    var indexedSystems = new Object();
    $.each(systems,function(index, system) {
      indexedSystems[system.id] = system;
    });
    localStorage.setItem('agaveSystems', JSON.stringify(indexedSystems));
  },

  set: function(system)
  {
    var systems = this.getAll();
    if (systems == null) {
      systems = Object();
      systems[job.id] = system;
    } else {
      systems[job.id] = system;
    }

    this.setAll(systems);
  },

  getDefaultStorage: function()
  {
    var systems = this.getAll();
    $.each(systems,function(index, system) {
      if (system.default && system.type == "STORAGE") return system;
    });
    return null;
  },

  getPublic: function()
  {
    var systems = this.getAll();
    var publicSystems = new Object();
    $.each(systems,function(index, system) {
      if (system.public) publicSystems[system.id] = system;
    });
    return publicSystems;
  },

  getPrivate: function()
  {
    var systems = this.getAll();
    var publicSystems = new Object();
    $.each(systems,function(index, system) {
      if (!system.public) publicSystems[system.id] = system;
    });
    return publicSystems;
  },

  isPublic: function()
  {
    var systems = this.getAll();
    $.each(systems,function(index, system) {
      if (system.default && system.type == "STORAGE") return system;
    });
    return null;
  },

  /* Retrieves system matching the given id. The list of systems
      was retrieved at login or page load and is cached in local
     storage
  */
  getAll: function()
  {
    return JSON.parse(localStorage.getItem("agaveSystems"));
  },

  /* Retrieves system matching the given id. The list of systems
      was retrieved at login or page load and is cached in local
     storage
  */
  get: function(systemId)
  {
    var systems = this.getAll();
    return systems[systemId];
  }
};
