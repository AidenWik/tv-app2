// import stuff
import { LitElement, html, css } from "lit";

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = "";
    this.presenter = "";
    this.id = "";

  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return "tv-channel";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      presenter: { type: String },
      location: { type: String },

    };
  }

  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: inline-flex;
      }

      .wrapper {
        height: 100%;
        width: 60%;
        text-decoration: none;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        font-size: 14px;
        padding: 3px 10px;
        min-height: 48px;
        line-height: 20px;
        box-sizing: content-box;
        position: relative;
        font-family: Roboto,Noto,sans-serif;
        -webkit-font-smoothing: antialiased;
        -webkit-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
        border: 1px solid #dadce0;
        border-radius: 5px;
        margin: 6px 0;
        background: #fff;
        font-weight: 600;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
}
`;
  }

  // LitElement rendering template of your element
  render() {
    return html`
       <div class="wrapper">
        <h3>${this.title}</h3>
        <h4>${this.presenter}</h4>
        <slot></slot>
      </div>
      `;
  }



}



// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
