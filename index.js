`use strict`

const apiKey = 'AIzaSyCd-3t5NPb4Zve-TPyz8mR9CbGXBnplFJ4';
const searchYTURL = 'https://www.googleapis.com/youtube/v3/search';
const searchTADBURL = 'https://www.theaudiodb.com/api/v1/json/1/search.php'
const searchLyricsOHVURL = 'https://api.lyrics.ovh/v1/';
// Used for retrieving the requested videoId
let vidId = '1';



// This function returns the width and height of the viewport
function determineVideoSize() {
    var test = document.createElement("div");

    test.style.cssText = "position: fixed;top: 0;left: 0;bottom: 0;right: 0;";
    document.documentElement.insertBefore(test, document.documentElement.firstChild);

    var dims = { width: test.offsetWidth, height: test.offsetHeight };
    document.documentElement.removeChild(test);
    // Determining the video size based on mobile viewport
    if (dims.width < 480) {
        return dims;
    }
    // Determining the video size based on tablet viewport
    else if (dims.width < 768) {
        dims.width = dims.width / 1.5;
        dims.height = dims.height / 1.5;
        return dims;
    }
    // Determining the video size based on desktop viewport
    else {
        dims.width = 640;
        dims.height = 390;
        return dims;
    }

}
//Display the requested song
function displayVideo(responseJson) {
    console.log(responseJson);
    vidId = responseJson.items[0].id.videoId.toString();
    loadVideo(vidId);
    $('#player').removeClass('hidden');
};

function displayArtistInfo (responseJson){
    $('#js-info').empty();
    $('#js-info').append(
        `<img src="${responseJson.artists[0].strArtistBanner.toString()}" alt="Artist Banner">
        <h2>${responseJson.artists[0].strArtist.toString()}</h2>
        <p>${responseJson.artists[0].strBiographyEN.toString()}</p>`
    );
    $('#info').removeClass('hidden');
}

function displayLyrics(responseJson){
    $('#js-lyrics').empty();
    $('#js-lyrics ').append(
    `<h2>Lyrics</h2>
    <p>${responseJson.lyrics}</p>`);
    $('#lyrics').removeClass('hidden');
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getYouTubeVideoId(query, maxResults) {
    const params = {
        key: apiKey,
        q: query,
        part: 'snippet',
        maxResults,
        type: 'video'
    };
    const queryString = formatQueryParams(params);
    const url = searchYTURL + '?' + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayVideo(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}


function getArtistInfo(query) {
    const params = {
        s: query
    };
    const queryString = formatQueryParams(params);
    const url = searchTADBURL + '?' + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayArtistInfo(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

}

function getLyrics(){
    const url = searchLyricsOHVURL + $('#js-search-artist').val().replace(' ','%20') + '/' + $('#js-search-song').val().replace(' ','%20');
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayLyrics(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}



function watchForm() {
    $('#js-form-artist').submit(event => {
        event.preventDefault();
        const searchArtist = $('#js-search-artist').val();
        getArtistInfo(searchArtist);
    });
    $('#js-form-song').submit(event => {
        event.preventDefault();
        const searchSong = $('#js-search-song').val();
        getLyrics();
        getYouTubeVideoId(searchSong, 1);
        
    });
}

function loadVideo(id) {
    player.loadVideoById({ videoId: id });
}



var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    let dims = determineVideoSize();
    player = new YT.Player('player', {
        // Height divided by 2 to equate to 2:1 aspect ratio
        height: `${dims.width / 2}`,
        width: `${dims.width}`,
        videoId: '',
        events: {
            'onReady': onPlayerReady
        }
    });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}




$(watchForm);