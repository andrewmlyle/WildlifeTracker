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
        Mapinit: false,
        markers: [],
        animals: [],
        sightings: [],
        mapOptions: {},
        lat: 0,
        long: 0,
        Latmessage: 0,
        Lngmessage: 0,
        selected: [],
        selected2: [],
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
    };

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
                    let desc = "";
                    for (let animal of app.vue.animals) {
                        if (sight.animal_id == animal.id) {
                            name = animal.animal_name;
                            desc = animal.animal_description;
                        }
                    }
                    axios.get(load_user_url, {params: {"id": sight.user_id}})
                    .then((result) => {
                        console.log(result.data.rows[0].email);
                        app.addMarker({lat: x, lng: y}, name, desc, result.data.rows[0].email, sight.id);
                    });
                }
            });
    };

    app.edit = function(id) {
        console.log(id);

        axios.get(edit_sighting_url, {params: {"id": id}})
            .then(function (response) {
                console.log(response);
                window.location.replace("../edit_sighting?id=" + id);
            });
    };

    app.delete = function(location, id) {
        console.log("calling delete");

        axios.get(delete_sighting_url, {params: {"id": id}})
            .then((result) => {
                console.log(result);
                for (let i = 0; i < app.vue.markers.length; i++) {
                    console.log(app.vue.markers[i].position.lat(), location.lat);

                    if (app.vue.markers[i].position.lat() == location.lat) {
                        console.log("deleting!");
                        app.vue.markers[i].setMap(null);
                        app.vue.markers.splice(i, 1);
                        break;
                    }
                }
            });
    };

    app.addMarker = function(location, animal, description, userEmail, id) {
        //console.log(location, animal, description, userEmail, id);
        const contentString =
            '<div class="card">' +
            '<header class="card-header">' +
            '<p class="card-header-title">Lat: ' +
            location.lat +
            ' | Lng: ' +
            location.lng +
            '</p>' +
            '</header>' +
            '<div class="card-content">' +
            '<div class="content">' +
            '<p>Animal Name: ' +
            animal +
            '</p>' +
            '<br>' +
            '<p>Animal Description: ' +
            description +
            '</p>' +
            '<br>' +
            '<p>Sighting Reported By: ' +
            userEmail +
            '</p>' +
            '</p>' +
            '</div>' +
            '</div>' +
            '<footer class="card-footer" id=' +
            id +
            '>' +
            '<a class="button is-success" id="editButt">' +
            '<i class="fa fa-edit">Edit</i>' +
            '</a>' +
            '<a class="button is-danger" id="delButt">' +
            '<i class="fa fa-trash">Delete</i>' +
            '</a>' +
            '</footer>' +
            '</div>';

        const infowindow = new google.maps.InfoWindow({
            content: contentString,
        });
        const marker = new google.maps.Marker({
            position: location,
            //label: app.vue.userName,
            icon: app.vue.icons[animal].icon,
            map: this.map,
        });

        marker.addListener("click", () => {
            const promise = new Promise((resolve, reject) => {
                infowindow.open(map, marker);
                setTimeout(() => resolve('Resolving an asynchronous request!'), 10)
            })

            // Log the result
            promise.then((response) => {
                //console.log(response)
                console.log(app.vue.userName, userEmail);

                let x = document.getElementById(id);
                //console.log(x);
                if (app.vue.userName == userEmail) {
                    x.style.display = "block";

                    document.getElementById("delButt").addEventListener("click", function() {
                        app.delete(location, id);
                        infowindow.close();
                        app.updateSightings();
                    });

                    document.getElementById("editButt").addEventListener("click", function() {
                        app.edit(id);
                        infowindow.close();
                        app.updateSightings();
                    });

                } else {
                    x.style.display = "none";
                }
            })

        });

        app.vue.markers.push(marker);
    };

    app.updateUser = function(user) {
        if (user) {
            this.userName = user.email;
        }
    }

    app.filterAnimal = function(event) {
        app.clearMarkers();

        for (let sight of app.vue.sightings) {
            if (event.target.value == -1 || event.target.value == sight.animal_id) {
                let x = parseFloat(sight.latitude);
                let y = parseFloat(sight.longitude);

                let name = "";
                let desc = "";
                for (let animal of app.vue.animals) {
                    if (sight.animal_id == animal.id) {
                        desc = animal.animal_description;
                        name = animal.animal_name;
                    }
                }

                axios.get(load_user_url, {params: {"id": sight.user_id}})
                    .then((result) => {
                        //console.log(result.data.rows[0].email);
                        app.addMarker({lat: x, lng: y}, name, desc, result.data.rows[0].email, sight.id);
                    });
            }
        }
    }

    app.add_sighting = function (Userid, user, Animalid, Animalname, lat, long, eid) {
        let flag = true;

        if (!lat) {
            flag = false;
            lat = app.vue.lat;
        }

        if (!long) {
            flag = false;
            long = app.vue.long;
        }

        if (!eid) {
            eid = -1;
        }

        axios.post(add_sighting_url, {id: eid, animal_id: Animalid, user_id: Userid, latitude: lat, longitude: long})
            .then(function (response) {
                console.log(response);
                let Adesc = app.vue.animals[Animalid].animal_description;
                app.addMarker({lat: app.vue.lat, lng: app.vue.long}, Animalname, Adesc, user["email"], response.data.id);
                document.getElementById("myModal").classList.toggle("is-active");
                app.vue.lat = 0;
                app.vue.long = 0;
            });

        app.updateSightings();
        if (flag) {
            console.log("refresh");
            window.location.replace('../index');
        }
    };

    app.addressTranslate = function() {
        axios.get("http://api.geonames.org/findNearestAddressJSON?lat=" + app.vue.lat + "&lng=" + app.vue.lat + "&username=arlogana")
            .then((result) => {
                let r = result.data.rows;
                app.enumerate(r);

                for (let i = 0; i < r.length; i++) {
                    //console.log(i, r[i]);
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

    app.setIdx = function () {
        console.log("in here");
        this.Mapinit = true;
    }
    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        filterAnimal: app.filterAnimal,
        add_sighting: app.add_sighting,
        close: app.close,
        err: app.err,
        delete: app.delete,
        edit: app.edit,
        setIdx: app.setIdx,
        addressTranslate: app.addressTranslate,
        updateUser: app.updateUser,
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
        if (app.vue.Mapinit) {
            app.initMap();
        }

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
                    let desc = "";
                    for (let animal of app.vue.animals) {
                        if (sight.animal_id == animal.id) {
                            name = animal.animal_name;
                            desc = animal.animal_description;
                        }
                    }
                    axios.get(load_user_url, {params: {"id": sight.user_id}})
                    .then((result) => {
                        console.log(result.data.rows[0].email);
                        app.addMarker({lat: x, lng: y}, name, desc, result.data.rows[0].email, sight.id);
                    });
                }
            });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
