document.querySelector(".glass-button").addEventListener("click", () => {
    document.querySelector(".glass-container").classList.toggle("active");
});

document.querySelector(".glass-container").addEventListener("transitionend", () => {
    console.log("Animation Complete!");
});