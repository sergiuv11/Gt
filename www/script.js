if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log('Service Worker Registered');
    });
}

// Location tracking
function sendLocation(position) {
    fetch('https://se-vin.com/gt/controler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }).then(response => response.text())
      .then(data => console.log(data));
}

function trackLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(sendLocation, (error) => {
            console.error('Error getting location:', error);
        }, {
            enableHighAccuracy: true
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

trackLocation();
