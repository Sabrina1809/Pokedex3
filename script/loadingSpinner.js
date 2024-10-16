let loadingText = [".", ".", ".", " ", "l", "o", "a", "d", "i", "n", "g", " ", ".", ".", "."];
let loadingTextInterval;

function startLoadingSpinner() {
    if (loadingTextInterval) {
        clearInterval(loadingTextInterval);
    }
    document.getElementById("loading_text").innerHTML = "";
    document.getElementById("loadingspinner_ctn").style.display = "flex";
    for (let i = 0; i < loadingText.length; i++) {
        setTimeout(() => showText(loadingText, i), i * 200); 
    }
    loadingTextInterval = setInterval(() => {
        document.getElementById("loading_text").innerHTML = "";
        for (let i = 0; i < loadingText.length; i++) {
            document.getElementById("loading_text").innerHTML = "";
            setTimeout(() => showText(loadingText, i), i * 200);
        }
    }, 3500);
}

function showText(loadingText, i) {
    document.getElementById("loading_text").innerHTML += loadingText[i];
}

function stopLoadingSpinner() {
    if (loadingTextInterval) {
        clearInterval(loadingTextInterval); 
    }
    document.getElementById("loading_text").innerHTML = "";
    document.getElementById("loadingspinner_ctn").style.display = "none";
}