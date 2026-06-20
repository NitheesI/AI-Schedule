// --- Geolocation API Logic ---
const locationBadge = document.getElementById('locationBadge');
const locationText = document.getElementById('locationText');

// Reset location badge
if (locationBadge && locationText) {
    locationText.textContent = "Detecting your location...";
    locationBadge.classList.add('hidden');
}

if ('geolocation' in navigator) {
    // Show badge with loading state
    locationBadge.classList.remove('hidden');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                // Use Nominatim API to translate coordinates into a readable city name
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                const data = await response.json();
                const city = data.address.city || data.address.town || data.address.village || data.address.state || "your area";
                locationText.textContent = `Schedule optimized for ${city}`;
            } catch (error) {
                // Fallback to coordinates if the API fails
                locationText.textContent = `Location coordinates: ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
            }
        },
        (error) => {
            // Hide the badge gracefully if the user denies permission
            locationBadge.classList.add('hidden');
            console.warn('Geolocation error:', error);
        }
    );
}