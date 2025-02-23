// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log('Service Worker Registered');
    }).catch(error => console.error('Service Worker registration failed:', error));
}

// Cordova deviceready event
document.addEventListener('deviceready', function() {

    // Enable background mode
    cordova.plugins.backgroundMode.enable();

    // Background Geolocation configuration
    BackgroundGeolocation.configure({
        desiredAccuracy: 10,
        stationaryRadius: 50,
        distanceFilter: 50,
        debug: true, // Debug sounds & notifications
        stopOnTerminate: false, // Keep tracking after app is closed
        url: 'https://se-vin.com/gt/controller.php',
        httpHeaders: {
            'Content-Type': 'application/json'
        },
        postTemplate: {
            latitude: '@latitude',
            longitude: '@longitude'
        }
    });

    // Start Background Geolocation
    BackgroundGeolocation.start();

    // Listen to location updates
    BackgroundGeolocation.on('location', function(location) {
        console.log('[BackgroundGeolocation] Location:', location);

        // Send location to server
        sendLocation(location.latitude, location.longitude);
    });

    // Function to send location data to your backend (for both background and foreground tracking)
    function sendLocation(latitude, longitude) {
        fetch('https://se-vin.com/gt/controller.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
            })
        })
        .then(response => response.text())
        .then(data => console.log('Location Sent Successfully:', data))
        .catch(error => console.error('Error Sending Location:', error));
    }

    // Foreground Geolocation Tracking (for active app use)
    function trackLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                const { latitude, longitude } = position.coords;
                console.log('[Foreground] Tracking Location:', latitude, longitude);

                // Send location to server
                sendLocation(latitude, longitude);
            }, function(error) {
                console.error('Foreground Geolocation Error:', error);
            }, {
                enableHighAccuracy: true
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    // Start Foreground Location Tracking
    trackLocation();

}, false);
