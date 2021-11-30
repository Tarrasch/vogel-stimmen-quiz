function startQuiz(): void {
    let url = new URL("./quiz.html", document.baseURI);
    url.searchParams.set("species", "km,bm");
    document.location.href = url.href;
}

function addDocumentListeners(): void {
    document.getElementById('start-quiz')?.addEventListener('click', startQuiz);
}

document.addEventListener("DOMContentLoaded", function () {
    addDocumentListeners();
});
