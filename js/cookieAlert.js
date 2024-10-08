const template = document.createElement('template');

template.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700&family=Josefin+Slab:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&family=Antic+Slab:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&family=Mulish:ital,wght@0,200;0,300;0,400;0,500;1,200;1,300;1,400&display=swap');
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css");

.container {
	color: rgb(255, 255, 255);
  background-color: #0fb746;
  padding: 1em 1.8em;
  width: 100%;
  font-family: "Baloo Da 2", serif;
  
}
.footer {
  position:fixed;
  left:0px;
  bottom:0px;
  width: 100%;
  
}

.button {
  color: rgb(255, 255, 255);
  background-color: transparent;
  border-color: rgb(255, 255, 255);
  padding: 5px 40px;
  margin-right: 50px;
  cursor: pointer;
  float:right;
  font-family: "Baloo Da 2", serif;
}
</style>

<div id="root" class="container footer">
  <span></span>
  <button class="button">Ok!</button>
</div>`;

class CookieAlert extends HTMLElement {
  constructor() {
      super();

      this._message = "Utilizamos cookies para que você tenha a melhor experiência do nosso site. Ao usar nosso site, você concorda com o uso e o armazenamento de cookies no seu dispositivo.";
      this.attachShadow({mode: "open"});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get message() {
    return this._message;
  }

  set message(value) {
    this._message = value;
    this.setAttribute("message", value);
  }

  connectedCallback() {
    const root = this.shadowRoot.getElementById("root");
    const cookiesAccepted = getCookie("cookiesAccepted")

    if (cookiesAccepted === "y") {
      root.style.visibility = "hidden";
    } else {
      root.querySelector("button").addEventListener("click", ()=>{
        root.style.visibility = "hidden";
        setCookie("cookiesAccepted", "y", 365);
      });
      this.updateMessage();  
    }
  }

  updateMessage() {
    this.shadowRoot.querySelector("span").innerHTML = this._message;
  }

  static get observedAttributes() {
    return ["message"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "message") {
        this._message = newValue;
        if (this.childElementCount>0) this.updateMessage();
      }
    }
  }
}


customElements.define("cookie-alert", CookieAlert);

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}