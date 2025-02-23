// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log('Service Worker Registered');
    });
}

// Cordova deviceready event
document.addEventListener('deviceready', function() {

    // Function to send location data to your backend
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
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    }

    // Function to continuously track location
    function trackLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                console.log('Tracking Location:', latitude, longitude);

                // Send location to server
                sendLocation(latitude, longitude);
            }, function(error) {
                console.error('Error getting location:', error);
            }, {
                enableHighAccuracy: true
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    // Start location tracking
    trackLocation();

}, false);
