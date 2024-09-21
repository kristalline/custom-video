import navigation from "./js/navigation";
import data from "./js/data";

const container = document.querySelector('.player');
const play = document.querySelectorAll('[data-video]');
const sound = document.querySelector('.sound');
const video = container.querySelector('[data-id]')
const playIcons = container.querySelectorAll('[data-icon-video]');
const soundIcons = container.querySelectorAll('[data-icon-sound]');
const timerEl = document.querySelector('[data-video-timer]');
const durationEl = document.querySelector('[data-video-duration]');
const progressBar = document.querySelector('.progress-bar');
const trackName = document.querySelector('[data-video-name]');
const volumeBar = document.querySelector('.volume-bar');

const state = {
    isPlayed: false,
    viewedId: []
}

const getTime = (time) => {    
    const hours = Math.floor(time / (60 * 60));
    const min = Math.floor((time % 3600) / 60);
    const sec = Math.floor(time - (hours * 3600) - (min * 60));
    const result = [];
    if (hours !== 0) {
        result.push(Math.floor(hours))
    };
    result.push(min);
    result.push(sec);
    return result.join(':');
};

const insertVideo = (id) => {
    video.setAttribute('data-id', id);
    const currentTrack = data.find((item) => Number(item.id) === Number(id));
    video.setAttribute('src', currentTrack.pathfile);
    video.setAttribute('poster', currentTrack.poster);
    trackName.textContent = currentTrack.name;
    state.viewedId.push(Number(id));
};

insertVideo(3);



video.ondurationchange = (event) => {
    console.log(event)
    console.log(durationEl, video.duration)
    timerEl.textContent = getTime(video.currentTime);    
    durationEl.textContent = getTime(video.duration);
};

setInterval(() => {
    timerEl.textContent = getTime(video.currentTime);
}, 1000);

const handlePlay = () => {
    const togglePlay = state.isPlayed ? 'pause' : 'play';
    state.isPlayed = !state.isPlayed;
    return video[togglePlay]();
};

const handleSound = () => {
    const toggleSound = video.muted ? false : true;
    video.muted = toggleSound;
};

const handleSoundBtn = (buttons) => buttons.forEach((button) => button.classList.toggle('shown'));

const handlePlayBtn = (buttons) => {
    const play = [...buttons].filter(button => button.dataset.iconVideo === 'play');
    const pause = [...buttons].filter(button => button.dataset.iconVideo === 'pause');
    console.log(play, pause);
    if (state.isPlayed) {
        play.forEach((item) => {
            item.classList.remove('shown');
        });
        pause.forEach((item) => {
            item.classList.add('shown');
        });

    } else {
        play.forEach((item) => {
            item.classList.add('shown');
        });
        pause.forEach((item) => {
            item.classList.remove('shown');
        });
    };
};

play.forEach((item) => {
    item.addEventListener('click', () => {
        handlePlay();
        handlePlayBtn(playIcons);
    });
});

sound.addEventListener('click', () => {
    handleSound();
    handleSoundBtn(soundIcons);
});

const setVideoTrackWidth = (val) => {
    const track = document.querySelector('.progress-track');
    const containerWidth = document.querySelector('.progress-bar').offsetWidth;
    track.style.setProperty('width', `${containerWidth * (val / 100) + 3}px`);
}

const setVolumeWidth = (val) => {
    const track = document.querySelector('.volume-track');
    const containerWidth = volumeBar.offsetWidth;
    track.style.setProperty('width', `${containerWidth * val}px`);
};
setVolumeWidth(volumeBar.value);

volumeBar.addEventListener('input', (event) => {
    console.log('volume', event)
    const val = event.target.value;
    console.log('progress:', event, val);
    video.volume = val;
    setVolumeWidth(val);
});

progressBar.addEventListener('input', (event) => {
    const val = event.target.value;
    console.log('progress:', event, val);
    const newTime = video.duration * val / 100;
    video.currentTime = newTime;
    setVideoTrackWidth(val);    
});

const range = (currentTime) => {    
    const value = currentTime / video.duration *100;
    progressBar.value = value;
    setVideoTrackWidth(value);
};

setInterval(() => {
    range(video.currentTime);
}, 100);

//controls visibility todo
const controls = document.querySelector('.controls');
const player = document.querySelector('.player-content');
let timer ;
const hideControls = () =>{ 
    timer = setTimeout(() => {
    controls.classList.add('hidden');
}, 9000);}

player.addEventListener('mouseenter', () => {
    controls.classList.remove('hidden');
    clearTimeout(timer);
});
container.addEventListener('mouseleave', () => {
    hideControls();
});

//navigation
const breakPoints = {
    1280: 4,
    960: 3,
    600: 2,
    400: 1,
};

const navigationContainer = document.querySelector('.navigation-container');
const currentWidth = () => window.innerWidth;

const getNumberOfCards = () => {
    const width = currentWidth();
    const keys = Object.keys(breakPoints);
    console.log(keys)
    const cuurrentBreakPoint = keys.find((key) => width <= key) ?? 1280;
    return breakPoints[cuurrentBreakPoint];
};

const addVideoCards = () => {
    // remove already viewed from data
    const filtered = data.filter((item) => !state.viewedId.includes(item.id));
    console.log('filtered', filtered, state.viewedId,);
    const cardsData = filtered.slice(0, getNumberOfCards());
    const newCardsList = navigation(cardsData) ?? 'Nothing left here, you saw all';
    navigationContainer.replaceChildren(newCardsList);
};

addVideoCards();

window.addEventListener("resize", () => {
    addVideoCards();
});

navigationContainer.addEventListener('click', ({ target }) => {
    const id = target.closest('a').dataset.id;
    insertVideo(Number(id));
    video.play();
    state.isPlayed = true;
    handlePlayBtn(playIcons);
    addVideoCards();
});
