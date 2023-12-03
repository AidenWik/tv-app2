// import stuff
import { LitElement, html, css } from "lit";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "./tv-channel.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = "";
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.contentSource = '../assets/1.html';
    this.contentListings = [];
    this.location = "";
    this.activeIndex = 0;
    this.activeTimer = false;
    this.timers = new Map();
    this.content = "";
    this.activeItem = {
      title: null,
      id: null,
      description: null,
    };

  }

  // convention I enjoy using to define the tag's name
  static get tag() {
    return "tv-app";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
    name: { type: String },
    source: { type: String },
    listings: { type: Array },
    activeItem: { type: Object },
    activeIndex: { type: Number },
    activeTimer: { type: Boolean},
    timers: { type: Object },
    content: { type: String },
    contentListings: { type: Array },
    location: { type: String },
    activeContent: { type: String },
  };
}
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
        :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .container {
        display: flex;
        flex-direction: column;
        position: relative;
        height: 100%;
        width: 100%;
      }
      /*The time-wrapper will be set up so that the time remaining will live
      above the time-code and thus the time-code will be below the time remaining */
      .time-wrapper {
        background: #fff;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
        color: #3c4043;
        display: flex;
        grid-area: title;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        justify-content: space-between;
        height: 64px;
        -webkit-font-smoothing: antialiased;
        z-index: 1000;
        max-width: 100vw;
      }
      .time-remaining {
        align-items: center;
        font-size: 16px;
        font-weight: 400;
        white-space: nowrap;
      }
      .mid-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        height: 100%;
      }
      /* The tv-channel items should be */
      tv-channel {
        position: relative;
        display: flex;
        height: 56px;
        width: 232px;
        padding: 8px;
      }
      .course-topics {
        width: 25.7%; /* Adjust width for the course topics */
      }
      .content-wrapper {
        width: 74.3%; /* Adjust width for the content */
      }
      .activeTitle {
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        border: 1px solid #dadce0;
        border-radius: 5px;
        background: #fff;
        max-width: 800px;
        margin: 0 auto 30px auto;
        padding: 20px;
      }
      .content {
        position: relative;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
        background: #fff;
        max-width: 800px;
        font-size: 14px;
        margin: 0 auto;
        margin-bottom: 90px;
        border-radius: 4px;
      }
      .next {
        position: absolute;
        bottom: 0;
        right: 0;
      }
      .previous {
        position: absolute;
        bottom: 0;
        left: 0;
      }

      `,
    ];
  }

  render() {
    return html`
    <div class="container">
    <div class="time-wrapper">
    <h1>${this.name}</h1>
    <div class="time-remaining">Time Remaining: </div>
    </div>
    <div class="mid-wrapper">
    <div class="course-topics">
      ${
        this.listings.map(
          (item) => html`
            <tv-channel
              id="${item.id}"
              title="${item.title}"
              description="${item.description}"
              content="${item.content}"
              location ="${item.location}"
              @click="${this.itemClick}"
            >
            </tv-channel>
          `
        )
      }
      </div>
      <div class="content-wrapper">
        <div class="activeTitle">activeTitle</div>
        <div class="content">content

        <button class="next" @click="${this.nextPage}">Next</button>
        <button class="previous" @click="${this.previousPage}">Previous</button>
        </div>
      </div>
    </div>
    </div>

    `;
  }
  updateActiveTitle() {
    const activeIndex = this.findActiveItemIndex();
    const activeTitle = this.shadowRoot.querySelector('.activeTitle');
    activeTitle.innerHTML = this.listings[activeIndex].title;
  }
  updateActiveIndex() {
    this.activeIndex = this.findActiveItemIndex();
  }
  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector(".dialog");
    dialog.hide();
  }
  updateTimeRemaining() {
    if (this.activeTimer){
      return;
    }
    console.log(this.activeIndex);
    const dialog = this.shadowRoot.querySelector('.dialog');
    const timeCode = this.shadowRoot.querySelector('.time-remaining');

    const updateTimer = () => {
      var minutes = Math.floor(this.listings[this.activeIndex].metadata.timecode / 60);
      var seconds = this.listings[this.activeIndex].metadata.timecode % 60;

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      const time = minutes + ":" + seconds;

      timeCode.innerHTML = "Time Remaining: " + time;

      if (this.listings[this.activeIndex].metadata.timecode <= 0) {
        dialog.hide();
        this.activeTimer = false;
        this.changeActiveUp();
        console.log(this.activeIndex)
      } else {
        this.listings[this.activeIndex].metadata.timecode--;
        setTimeout(updateTimer, 1000);

      }
    };
    this.activeTimer = true;
    updateTimer();
  }

  changeActiveUp(){
    if(this.activeIndex < this.listings.length - 1){
      this.activeIndex = this.activeIndex + 1;
      this.updateTimeRemaining();
    }
    if(this.activeIndex > this.listings.length - 1 || this.activeIndex === this.listings.length - 1){
      return;
    }
  }

   /*This will change the active index to the previous element in the listings array*/
   changeActiveDown(){
    this.activeIndex = this.findActiveItemIndex();
    this.activeIndex = this.activeIndex - 1;
    if(this.activeIndex < 0)
      this.activeIndex = 0;
    console.log(this.activeIndex);
  }
  findActiveItemIndex() {
    //this.updateActiveTitle();
    const activeId = this.activeItem.id;
    // Find the index of the element in listings that matches activeItem
    const index = this.listings.findIndex(item => (
      item.id === activeId
    ));
    if(index === -1) {
      return 0;
    }
    return index;
  }
  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }
  itemClick(e) {
    console.log(e.target);
    this.activeItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
    };
    const dialog = this.shadowRoot.querySelector('.dialog');
    this.updateActiveIndex();
    this.updateTimeRemaining();
    dialog.show();
    console.log(this.activeIndex);
    console.log(this.content);
  }
  /*acts when the next button is clicked and goes to the next element of channels.json*/
  nextPage() {
    console.log("next page");
    /* Bring user to the next channels.json element */
    if (this.activeIndex < this.listings.length - 1)
      this.changeActiveUp();
    }
    /*acts when the previous button is clicked*/
    previousPage() {
      console.log("previous page");
      /* Bring user to the previous channels.json element */
      if(this.activeIndex > 0)
        this.changeActiveDown();
    }

    updatedContent(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "contentSource" && this[propName]) {
          this.updateContentSourceData(this[propName]);
        }
      });
    }
    async updateSourceData(source) {
      await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
        if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
          this.listings = [...responseData.data.items];
          console.log(this.listings);
        }
      });
    }
    async updateContentSourceData(contentSource) {
      fetch(contentSource)
       .then(response => response.text())
        .then(text => console.log(text))
        .catch(err => console.log(err));
      await fetch(contentSource) // fetch the content
        .then(function(response) {
          return response.text();
        })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");
          this.content = doc;
          console.log(doc);
        });
      }
    }



// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
