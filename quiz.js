function makeRecording(input) {
    return {
        soundFileUrl: "https:" + input.file,
        recorderName: input.rec,
        englishName: input.en,
        genericName: input.gen,
        scientificName: input.sp
    };
}
function makeXenoCantoApiResponse(input) {
    return {
        numRecordings: parseInt(input.numRecordings),
        page: input.page,
        numPages: input.numPages,
        recordings: input.recordings.map(makeRecording)
    };
}
var BIRDS = [
    { queryName: "Parus Major", germanName: "Kohlmeise" },
    { queryName: "Cyanistes Caeruleus", germanName: "Blaumeise" },
];
function buildQuery(queryOptions) {
    return queryOptions.birdQueryName + " area:europe q:A type:song";
}
function wrapInJsonProxy(url) {
    return "https://jsonp.afeld.me/?url=" + url;
}
function getApiUrl(raw_query) {
    return wrapInJsonProxy("https://www.xeno-canto.org/api/2/recordings?query=" + raw_query);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function selectRandomBird() {
    return BIRDS[getRandomInt(BIRDS.length)];
}
function selectRandomRecording(response) {
    return response.recordings[getRandomInt(response.recordings.length)];
}
function updateHtmlElements(birdToGuess, recording) {
    var audio_element = document.getElementById('audio');
    audio_element.src = recording.soundFileUrl;
    audio_element.play();
    var choicesDiv = document.getElementById('choices');
    var _loop_1 = function (bird) {
        var isCorrectAnswer = bird.queryName === birdToGuess.queryName;
        var newButton = document.createElement("button");
        newButton.textContent = bird.germanName;
        newButton.addEventListener('click', function (_) {
            var answerParagraph = document.getElementById('congratulation-p');
            answerParagraph.textContent = bird.germanName + " is " + (isCorrectAnswer ? "the" : "NOT") + " correct answer";
        });
        choicesDiv.appendChild(newButton);
    };
    for (var _i = 0, BIRDS_1 = BIRDS; _i < BIRDS_1.length; _i++) {
        var bird = BIRDS_1[_i];
        _loop_1(bird);
    }
}
var birdToGuess = selectRandomBird();
fetch(getApiUrl(buildQuery({ birdQueryName: birdToGuess.queryName })))
    .then(function (response) { return response.json(); })
    .then(function (data) {
    var response = makeXenoCantoApiResponse(data);
    var recording = selectRandomRecording(response);
    updateHtmlElements(birdToGuess, recording);
});
