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
        markers: [],
        animals: [],
        sightings: [],
        mapOptions: {},
        lat: 0,
        long: 0,
        selected: [],
        errorMsg: "",
        address: "",
        filter: 0,
        userName: "",
        icons: {
            monkey: {
                icon: {
                    url: "https://png2.cleanpng.com/sh/e722d7198746faee31a101f237023519/L0KzQYm3UsA2N6JtfZH0aYP2gLBuTfNpcZ51edDFZXWwccHsTgBzcZ5mjNc2bXBxe7bCTfdweppxhNM2NXG6SLK9g8dlPmpqfqo3NEWzQIGAUcgyPWI8UKcBNEW4SIiCUb5xdpg=/kisspng-chimpanzee-ape-primate-monkey-gorilla-5a78a6c7d69ef8.4500071815178564558791.png", // url
                    scaledSize: new google.maps.Size(35, 35), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                },
            },
            giraffe: {
                icon: {
                    url: "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/17652/giraffe-head-clipart-md.png",
                    scaledSize: new google.maps.Size(35, 35), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                },
            },
            bear: {
                icon: {
                    url: "https://www.clipartmax.com/png/middle/233-2331984_teddy-bear-face-clip-art-realistic-bear-clip-art.png",
                    scaledSize: new google.maps.Size(35, 35), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                },
            },
            wolf: {
                icon: {
                    url: "https://www.clipartmax.com/png/middle/15-150287_gray-wolf-clip-art-9dc4brkdce-wolf-head-clipart-transparent.png",
                    scaledSize: new google.maps.Size(35, 35), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                },
            },
            baldeagle: {
                icon: {
                    url: "https://www.pngjoy.com/pngm/267/5117513_eagle-head-illustration-of-a-bald-eagle-transparent.png",
                    scaledSize: new google.maps.Size(35, 35), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                },
            },
            deer: {
                icon: {
                    url: "https://www.pikpng.com/pngl/m/531-5319055_deer-free-to-use-clip-art-roe-deer.png",
                    scaledSize: new google.maps.Size(35, 35), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                },
            },
            turtle: {
                icon: {
                    url: "https://toppng.com/uploads/preview/turtle-png-green-sea-turtle-11563088791mqlagg4hpd.png",
                    scaledSize: new google.maps.Size(35, 35), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                },
            },
        },
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.clearMarkers = function() {
        for (let i = 0; i < app.vue.markers.length; i++) {
            app.vue.markers[i].setMap(null);
        }
        app.vue.markers = [];
    }
    app.updateSightings = function() {
        axios.get(load_sighting_url)
            .then((result) => {
                let r = result.data.rows;
                app.enumerate(r);
                app.vue.sightings = r;
            })
            .then(() => {
                for (let sight of app.vue.sightings) {
                    let x = parseFloat(sight.latitude);
                    let y = parseFloat(sight.longitude);
                    let name = "";
                    for (let animal of app.vue.animals) {
                        if (sight.animal_id == animal.id) {
                            name = animal.animal_name;
                        }
                    }

                    app.addMarker({lat: x, lng: y}, name);
                }
            });
    };

    app.addMarker = function(location, animal) {
        const marker = new google.maps.Marker({
            position: location,
            //label: app.vue.userName,
            icon: app.vue.icons[animal].icon,
            map: this.map,
        });

        marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.setContent("test");
            infoWindow.open(marker.getMap(), marker);
        });

        app.vue.markers.push(marker);
    };

    app.filterAnimal = function(event) {
        console.log(event.target.value);
        app.clearMarkers();

        for (let sight of app.vue.sightings) {
            if (event.target.value == -1 || event.target.value == sight.animal_id) {
                let x = parseFloat(sight.latitude);
                let y = parseFloat(sight.longitude);

                let name = "";
                for (let animal of app.vue.animals) {
                    if (sight.animal_id == animal.id) {
                        name = animal.animal_name;
                    }
                }

                console.log(name);
                app.addMarker({lat: x, lng: y}, name);
            }
        }
    }

    app.add_sighting = function (Userid, User, Animalid, Animalname) {
        console.log(Animalname);
        app.vue.userName = User['first_name'];
        axios.post(add_sighting_url, {animal_id: Animalid, user_id: Userid, latitude: app.vue.lat, longitude: app.vue.long})
            .then(function (response) {
                //console.log(response);
                app.addMarker({lat: app.vue.lat, lng: app.vue.long}, Animalname);
                document.getElementById("myModal").classList.toggle("is-active");
                app.vue.lat = 0;
                app.vue.long = 0;
            });

        app.updateSightings();
    };

    app.addressTranslate = function() {
        axios.get("http://api.geonames.org/findNearestAddressJSON?lat=" + app.vue.lat + "&lng=" + app.vue.lat + "&username=arlogana")
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    //console.log(i, result[i]);
                }
            });
    };

    app.close = function() {
        document.getElementById("myModal").classList.toggle("is-active");
        app.vue.lat = 0;
        app.vue.long = 0;
        app.vue.errorMsg = "";
    }

    app.err = function() {
        app.vue.errorMsg = "Please make an account to add sightings user!\n";
    }

    app.initMap = function(){
        this.mapOptions = {
            center: new google.maps.LatLng(37.354090, -122.001240),
            zoom: 10,
            disableDefaultUI: true,
        }
        this.map = new google.maps.Map(document.getElementById("map"), this.mapOptions);
        google.maps.event.addListener(this.map, "click", (event) => {
            app.vue.lat = event.latLng.lat();
            app.vue.long = event.latLng.lng();
            //TODO:
            //app.addressTranslate();

            document.getElementById("myModal").classList.toggle("is-active");
        });
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        filterAnimal: app.filterAnimal,
        add_sighting: app.add_sighting,
        close: app.close,
        err: app.err,
        addressTranslate: app.addressTranslate,
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
                let r = result.data.rows;
                app.enumerate(r);
                app.vue.animals = r;
            });
        axios.get(load_sighting_url)
            .then((result) => {
                let r = result.data.rows;
                app.enumerate(r);
                app.vue.sightings = r;
            })
            .then(() => {
                for (let sight of app.vue.sightings) {
                    let x = parseFloat(sight.latitude);
                    let y = parseFloat(sight.longitude);
                    let name = "";
                    for (let animal of app.vue.animals) {
                        if (sight.animal_id == animal.id) {
                            name = animal.animal_name;
                        }
                    }

                    app.addMarker({lat: x, lng: y}, name);
                }
            });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
