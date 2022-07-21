// apiを取得するために定数を宣言
const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";

// 問題を表示するために定数を宣言
const typeDisplayElement = document.getElementById("typeDisplay");

// ユーザーの入力を定数に宣言
const typeInputElement = document.getElementById("typeInput");

// タイマー表示のために定数を宣言
const timer = document.getElementById("timer");

// サウンド
const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

// 問題と入力の合否を判定
typeInputElement.addEventListener("input", () => {
    //  タイプ音をつける
    typeSound.play();
    typeSound.currentTime = 0;

    // 問題の文字のspanタグを取得
    const sentence = typeDisplayElement.querySelectorAll("span");

    // 入力した文字を取得
    const arrayValue = typeInputElement.value.split("");
    let correct = true;

    // 文字数分くり返し
    sentence.forEach((characterSpan, index) => {

        // 何も入力しない時は合否を表示しない
        if (arrayValue[index] == null) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;

            // 問題の文字と一致
        } else if (characterSpan.innerText == arrayValue[index]) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");

            // 問題の文字と不一致
        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");
            correct = false;

            // サウンドの再生
            wrongSound.volume = 0.3;
            wrongSound.play();
            wrongSound.currentTime = 0;
        }
    });

    // 次の文章へ
    if (correct) {
        correctSound.play();
        correctSound.currentTime = 0;
        RenderNextSentence();
    }
});

// 非同期でランダムな文章を取得
function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
        .then((response) => response.json())

        // json化した文字列を取得
        .then((data) => data.content);
}

// 次のランダムな文章を取得する
async function RenderNextSentence() {
    const sentence = await GetRandomSentence();
    console.log(sentence);

    // ディスプレイに表示
    typeDisplayElement.innerText = "";
    sentence.split("").forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        typeDisplayElement.appendChild(characterSpan);

        // 確認
        console.log(characterSpan);
    });

    // テキストボックスの中身を消す
    typeInputElement.value = null;

    // タイマーのリセット
    StartTimer();
}

let startTime;

// カウントダウンの時間を指定
let originTime = 120;

// カウントアップを開始
function StartTimer() {
    timer.innerText = originTime;

    // 残りの秒数を表示
    startTime = new Date();
    console.log(startTime);
    setInterval(() => {
        timer.innerText = originTime - getTimerTime(); /* １秒ずれて呼び出される */
        if (timer.innerText <= 0) TimeUp();
    }, 1000);
}

function getTimerTime() {

    // 小数点を切り捨て
    return Math.floor(

        // 現在の時刻 - １秒前の時刻 = 1s
        (new Date() - startTime) / 1000
    );
}

// 残り時間が0になると次の問題へ
function TimeUp() {
    console.log("next sentence");
    RenderNextSentence();
}

RenderNextSentence();
