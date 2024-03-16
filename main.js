//constructor responcible for media-player
class VideoPlayer {
  #videoPlayerEl;
  constructor() {
    this.file = null;
    this.duration = null;
    this.#videoPlayerEl = document.createElement("section");
    this.#videoPlayerEl.classList.add("media-player");
    this.#videoPlayerEl.innerHTML = `
    <header>
      <p class="logo">Video Player</p>
      <div class="form">
        <label for="videoInput">Choose file to play:</label>
        <input type="file" accept="video/*" name="videoInput" class="videoInput" />
      </div>
    </header>
    <main>
        <video class="videoFrame" src=""></video>
    </main>
    <footer class="controls">
      <div class='controls-btn'>
        <button data-control='play'><i class="fa-solid fa-play"></i></button>
        <button data-control='stop'><i class="fa-solid fa-stop"></i></button>
        <button data-control='mute'><i class="fa-solid fa-volume-high"></i></button>
        <button data-control='fullsize' class='fullsize'><i class="fa-solid fa-expand"></i></button>

      </div>
      <div class='range-container'>
        <input type='range' min='0' max='100' value='0'>
      </div>
      <div class='video-timer'>
      </div>
    </footer>
    `;
    this.videoEl = this.#videoPlayerEl.querySelector(".videoFrame");
    this.videoInput = this.#videoPlayerEl.querySelector(".videoInput");
    this.controlsElem = this.#videoPlayerEl.querySelector(".controls");
    this.progressElem = this.#videoPlayerEl.querySelector("[type='range']");
    this.videoTimerElem = this.#videoPlayerEl.querySelector(".video-timer");

    this.videoInput.addEventListener("change", () => {
      this.selectFile();
      this.progressElem.value = 0;
    });
    //when video element changes time
    this.videoEl.addEventListener("timeupdate", () => {
      let currentTime = this.videoEl.currentTime;
      const duration = this.videoEl.duration;
      const progress = (currentTime / duration) * 100;
      this.progressElem.value = progress;
      this.videoTimerElem.innerHTML = `
      <span>${this.convertSecondsToTimeString(currentTime)} / ${this.convertSecondsToTimeString(duration)}</span>
      `;
    });
    //when video ends
    this.videoEl.addEventListener("ended", () => {
      this.controlsElem.querySelector('[data-control="play"]').innerHTML = '<i class="fa-solid fa-play"></i>';
    });

    //if we wand to expand videocontainer
    this.#videoPlayerEl.addEventListener("dblclick", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        this.#videoPlayerEl.requestFullscreen();
      }
    });
    //when videodata is loaded
    this.videoEl.addEventListener("loadeddata", (e) => {
      let duration = this.videoEl.duration;
      let currentTime = this.videoEl.currentTime;
      this.videoTimerElem.innerHTML = `
      <span>${this.convertSecondsToTimeString(currentTime)} / ${this.convertSecondsToTimeString(duration)}</span>`;
      this.progressElem.value = (currentTime / duration) * 100;
    });
    //controls handler
    this.controlsElem.addEventListener("click", (e) => {
      let control = e.target.dataset.control;
      let target = e.target;
      switch (control) {
        case "play":
          if (this.videoEl.paused && this.videoEl.duration > this.videoEl.currentTime) {
            this.videoEl.play();
            target.innerHTML = '<i class="fa-solid fa-pause"></i>';
          } else if (this.videoEl.paused && this.videoEl.duration == this.videoEl.currentTime) {
            this.videoEl.currentTime = 0;
            this.videoEl.play();
            target.innerHTML = '<i class="fa-solid fa-pause"></i>';
          } else {
            this.videoEl.pause();
            target.innerHTML = '<i class="fa-solid fa-play"></i>';
          }
          break;
        case "stop":
          this.videoEl.pause();
          this.videoEl.currentTime = 0;
          this.controlsElem.querySelector('[data-control="play"]').innerHTML = '<i class="fa-solid fa-play"></i>';
          break;
        case "mute":
          this.videoEl.muted = !this.videoEl.muted;
          const muteBtn = this.controlsElem.querySelector('[data-control="mute"');
          muteBtn.innerHTML = !this.videoEl.muted
            ? '<i class="fa-solid fa-volume-high"></i>'
            : '<i class="fa-solid fa-volume-xmark"></i>';

          break;
        //expands just video element
        case "fullsize":
          if (document.fullscreenElement) {
            document.exitFullscreen().then(() => {
              this.videoEl.requestFullscreen();
            });
          } else {
            this.videoEl.requestFullscreen();
          }
          break;
      }
    });
    //when we input video file
    this.progressElem.addEventListener("input", (e) => {
      const progressValue = this.progressElem.value;
      const newTime = (progressValue / 100) * this.videoEl.duration;
      this.videoEl.currentTime = newTime;
    });
  }
  //get whole media - plalyer element
  get videoPlayerEl() {
    return this.#videoPlayerEl;
  }
  //function to select file
  selectFile() {
    this.file = this.videoInput.files[0];
    if (this.file) {
      const videoUrl = URL.createObjectURL(this.file);
      this.videoEl.src = videoUrl;
    }
  }
  //to show video time from seconds in hh:mm:ss format
  convertSecondsToTimeString(sec) {
    sec = Math.floor(sec);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(sec / 60 / 60);
    sec %= 60;
    return hour == 0 && min == 0
      ? `${this.addFirstZero(min)}:${this.addFirstZero(sec)}`
      : `${this.addFirstZero(hour)}:${this.addFirstZero(min)}:${this.addFirstZero(sec)}`;
  }
  //adds 0 to numbers < 10
  addFirstZero(num) {
    return num < 10 ? `0${num}` : num;
  }
}

const player = new VideoPlayer();
const containerEl = document.querySelector(".container");
containerEl.append(player.videoPlayerEl);
