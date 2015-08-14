var Token = {
  _watch: null,
  set: function(token)
  {
      if (typeof (Storage) !== "undefined")
      {
          var tokenLifetime = 1000 * 60 * 60 * 4; // 4 hours
          var currentTime = new Date();

          localStorage.setItem("agaveToken", token);
          localStorage.setItem("agaveTokenExpiration", (currentTime.getTime() + tokenLifetime));

          var that = this;
          this._watch = setInterval(function() {
            // console.log("Checking token status " + jobId);

            if (!that.isValid()) {
              alert("Token has expired. Please login again.");
              that.clear();
            }
          }, 100000);
      }
  },

  isValid: function(token)
  {
      if (typeof (Storage) !== "undefined")
      {
          var token = localStorage.getItem("agaveToken");
          var tokenExpiration = localStorage.getItem("agaveTokenExpiration");
          if (token && tokenExpiration)
          {
              var currentTime = new Date();
              if (tokenExpiration > new Date().getTime()) {
                  return true;
              } else {
                  this.clear();
                  return false;
              }
          }
          else
          {
              this.clear();
              return false;
          }
      }
  },

  clear: function()
  {
      if (typeof (Storage) !== "undefined")
      {
          localStorage.removeItem("agaveToken");
          localStorage.removeItem("agaveTokenExpiration");
          clearInterval(this._watch);
      }
  },

  get: function()
  {
      if (typeof (Storage) !== "undefined")
      {
          return localStorage.getItem("agaveToken");
      }
      else
      {
          return '';
      }
  }
};
