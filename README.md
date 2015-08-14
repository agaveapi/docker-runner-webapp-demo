# Agave Docker Runner Webapp Demo

Simple front-end webapp to run Docker compute containers via Agave. To see the live demo,
view the GitHub Pages branch of this repo.

### Running 

To run this locally, clone this repository into your web server root directory and open the `index.html` file in your local web browser. If you do not have a web server installed, you can use the simple [Node static](http://nodejs.org) development server included in this repository.

```
node server.js
```

By default the server will run on port `9001`. You can view the app at [http://localhost:9001/]().


### Developing

This app is a very basic front-end webapp which uses prebuilt versions of Twitter Bootstrap and jQuery. It is safe to edit the javascript and css files in place and refresh. No rebuilding is needed.