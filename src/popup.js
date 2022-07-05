"use strict";

const showPage = (()=> {
  let currentPage = "start";
  return async (page_id, props={}) => {
    document.getElementById(currentPage).style.display = "none";
    currentPage = page_id;
    document.getElementById("loading").style.display = "flex";
    await PAGES[page_id].render(props);
    document.getElementById("loading").style.display = "none";
    document.getElementById(page_id).style.display = "flex";
  };
})()

var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic dXNlcjpwYXNz");
myHeaders.append("Content-Type", "application/json");

var raw = "{\"jsonrpc\": \"1.0\", \"id\": \"peers\", \"method\": \"getpeerinfo\"}";

var prefix_requestOptions = {
  method: 'GET',
  redirect: 'follow'
};


var core_requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

const getPeers = async () => {
  try {
    const response = await fetch(RPC_URL, core_requestOptions);
    return await response.text();
  } catch (error) {
    return console.log('error', error);
  }
};

const renderPeersPage = async (props) => {
  const peers = await getPeers();
  localStorage.setItem("peers", peers);
  const peerlist = JSON.parse(peers);

  for(var i = 0; i < peerlist.result.length; i++) {
    const address_port = String(peerlist.result[i].addr);
    const ip_address = address_port.substring(0, address_port.indexOf(':'));
    document.getElementById('passphrase').innerHTML +=  ip_address + '<br>';

  /*

    fetch("https://rpki-validator.ripe.net/validity?asn=AS63949&prefix=" + ip_address + "/32", prefix_requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  */

};

const staticRender = async (props) => {};

const initialize = async () => {
  Object.keys(PAGES).forEach(
    (page) => (document.getElementById(page).style.display = "none")
  );
  await showPage("loading");

  document
    .querySelector(".logo-container")
    .addEventListener("click", async () => showPage("start"));
  document
    .getElementById("peers-btn")
    .addEventListener("click", async () => showPage("peers"));
  document
    .getElementById("settings-btn")
    .addEventListener("click", async () => showPage("settings"));


  await showPage("start");
};

const RPC_URL = "http://127.0.0.1:18332/";
const PAGES = {
  "start": {render: staticRender},
  "peers": {render: renderPeersPage},
  "settings": {render: staticRender},
  "loading": {render: staticRender},
};
const INIT_ACCOUNTS = [];

initialize();
