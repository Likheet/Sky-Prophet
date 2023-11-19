'use strict';

import {updateWeather , error404} from "./app.js"
const defaultLocation="#/weather?lat=51.5073219&lon=-0.1276474";
const approximatelocation = async () => {
    try {
        let ipResponse = await fetch("https://api.ipify.org/?format=json");
        let ipData = await ipResponse.json();
        let ip = ipData.ip;
        let locationResponse = await fetch(`https://ipinfo.io/${ip}?token=c177813f87d9fa`);
        let locationData = await locationResponse.json();
        const[latitude, longitude] = locationData.loc.split(",");
        updateWeather(`lat=${latitude}`,`lon=${longitude}`)
        window.location.hash=`#/approximatelocation`;
    } catch (error) {
        console.error("Error fetching location data:", error);
    }
};
const currentLocation = function(){
    window.navigator.geolocation.getCurrentPosition(res=>{
        const{latitude,longitude}=res.coords;
        updateWeather(`lat=${latitude}`,`lon=${longitude}`)
    },err=>{
        window.location.hash = "#/approximatelocation";
    })
}
const searchedLocation = query=>updateWeather(...query.split("&"));
const routes = new Map([
    ["/current-location",currentLocation],
    ["/weather",searchedLocation],
    ["/approximatelocation",approximatelocation]
]);
const checkHash = function(){
    const requestURL = window.location.hash.slice(1);
    const [route , query] = requestURL.includes ? requestURL.split("?") : [requestURL];
    routes.get(route) ? routes.get(route)(query) : error404();
}
window.addEventListener("hashchange",checkHash)
window.addEventListener("load",function(){
    if(!window.location.hash)
        window.location.hash="#/current-location";
    else
        checkHash();
})