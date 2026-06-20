document.getElementById("openApp").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://component-library-omega-tawny.vercel.app/" });
  
});