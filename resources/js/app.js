(function () {
    var main = {
        settings: {
            fb: {
                apiKey: "AIzaSyBiB9PF7J6ktbE2prS-EsmD1s0_ZXHN-iU",
                authDomain: "resume-2871d.firebaseapp.com",
                databaseURL: "https://resume-2871d.firebaseio.com",
                storageBucket: "resume-2871d.appspot.com",
                messagingSenderId: "860759626833"
            }
        },
        register: function () {
            main.helper.loadOctapushPlugins(function () {
                firebase.initializeApp(main.settings.fb);
                main.helper.fb.contact();
                //console.log(main.helper.fb.contact());
            });
        },
        ui: {},
        events: {},
        helper: {
            loadOctapushPlugins: function (callback) {
                _o_.settings.pluginsPath = 'resources/js/octapushJS/plugins/';
                _o_.utility.importPlugin('string', callback);
            },
            fbFetch: {
                contact: function () {
                    firebase
                        .database()
                        .ref()
                        .once('value')
                        .then(function(data) {
                            console.log(data.val());
                        });
                }
            }
        }
    };

    main.register.apply();
})();