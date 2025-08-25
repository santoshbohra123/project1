// No require() here; data is passed from EJS

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // [lng, lat]
    zoom: 10
});

console.log(listing.geometry.coordinates);

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.location}</h4> <p>Exact location provided after booking.</p>`))
    .addTo(map);
