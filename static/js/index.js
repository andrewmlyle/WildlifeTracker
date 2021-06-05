// This will be the object that will contain the Vue attributes
// and be used to initialize it.

let app = {};

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {
    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        map: null,
        animals: [],
        sightings: [],
        mapOptions: {},
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.addMarker = function(location) {
        console.log(location);
        new google.maps.Marker({
            position: location,
            label: 'A',
            map: this.map,
        });
    };

    app.initMap = function(){
        this.mapOptions = {
            center: new google.maps.LatLng(37.354090, -122.001240),
            zoom: 10,
            disableDefaultUI: true,
        }
        this.map = new google.maps.Map(document.getElementById("map"), this.mapOptions);
        google.maps.event.addListener(this.map, "click", (event) => {
            //console.log(event.latLng);
            //console.log(event.Tb.x, event.Tb.y);
            //this.addMarker(event.Tb.x, event.Tb.y);
            this.addMarker(event.latLng);
        });
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
    });

    // And this initializes it.
    app.init = () => {
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
        app.initMap();
        axios.get(load_animal_url)
            .then((result) => {
                console.log(result.data.rows);
                let r = result.data.rows;
                app.enumerate(r);
                //app.complete(r);
                app.vue.animals = r;
                //app.vue.user_email = result.data.email;
            });
        axios.get(load_sighting_url)
            .then((result) => {
                console.log(result.data.rows);
                let r = result.data.rows;
                app.enumerate(r);
                //app.complete(r);
                app.vue.sightings = r;
                //app.vue.user_email = result.data.email;
            })
            .then(() => {
                for (let sight of app.vue.sightings) {
                    let x = parseFloat(sight.latitude);
                    let y = parseFloat(sight.longitude);
                    let tmp = {lat: x, lng: y};
                    console.log(tmp, x, y);
                    app.addMarker(tmp);
                }
            });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);