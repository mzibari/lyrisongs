`use strict`


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    let dims = determineVideoSize();
    player = new YT.Player('player', {
        // Height divided by 2 to equate to 2:1 aspect ratio
        height: `${dims.width / 2}`,
        width: `${dims.width}`,
        videoId: 'M7lc1UVf-VE',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}

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