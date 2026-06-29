document.addEventListener("DOMContentLoaded", () => {
  console.log("GlowMind popup loaded");

  const btn = document.getElementById("openApp");

  if (!btn) {
    console.error("Button not found!");
    return;
  }

  btn.addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://glowmind-mkql.vercel.app/"
    });
  });
});