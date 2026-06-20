document.getElementById("openApp").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://glowmind-mkql.vercel.app/" });
  
});