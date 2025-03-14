var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var AIList = [];
var currentAI = null;
var correctCount = 0;
var totalCount = 0;
// 成績を表示する要素
var scoreDisplay = document.getElementById('scoreDisplay');
// JSONデータを読み込む
fetch('src/GenerativeAI_QA.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
    AIList = data;
    updateScoreDisplay(); // 初回成績表示
    nextQuestion(); // 最初の問題を表示
});
// 次の問題を表示
function nextQuestion() {
    var upperText = document.getElementById('upperText');
    var choicesDiv = document.getElementById('choices');
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    result.textContent = ''; // 結果をクリア
    choicesDiv.innerHTML = ''; // 選択肢をクリア
    // ランダムに1つ選ぶ
    currentAI = AIList[Math.floor(Math.random() * AIList.length)];
    upperText.textContent = currentAI.upper;
    // 下の句を4択（正解+不正解3つ）
    var wrongChoices = AIList
        .filter(function (k) { return k.number !== currentAI.number; })
        .sort(function () { return Math.random() - 0.5; })
        .slice(0, 3)
        .map(function (k) { return k.lower; });
    var allChoices = __spreadArray(__spreadArray([], wrongChoices, true), [currentAI.lower], false).sort(function () { return Math.random() - 0.5; });
    allChoices.forEach(function (choice) {
        var choiceDiv = document.createElement('div');
        choiceDiv.textContent = choice;
        choiceDiv.classList.add('option'); // ✅ <button> ではなく <div> に変更
        choiceDiv.onclick = function () { return checkAnswer(choice, choiceDiv); }; // ✅ 選択時の動作
        choicesDiv.appendChild(choiceDiv);
    });
    nextButton.style.display = 'none'; // 「次の問題へ」ボタンを非表示
}
// 正解チェック
function checkAnswer(selected, selectedDiv) {
    var result = document.getElementById('result');
    var nextButton = document.getElementById('nextButton');
    var choiceButtons = document.querySelectorAll('.option'); // ✅ すべての選択肢を取得
    totalCount++;
    if (selected === currentAI.lower) {
        correctCount++;
        result.innerHTML = "\u6B63\u89E3\uFF01\uD83C\uDF89";
        result.style.color = 'green';
        selectedDiv.classList.add('correct'); // ✅ 正解時のスタイル追加
    }
    else {
        result.innerHTML = "\u6B8B\u5FF5\uFF01\u6B63\u89E3\u306F\u300C".concat(currentAI.lower, "\u300D");
        result.style.color = 'red';
        selectedDiv.classList.add('wrong'); // ✅ 間違い時のスタイル追加
    }
    updateScoreDisplay();
    // ✅ すべての選択肢を無効化して、連打で正解数を稼げないようにする
    choiceButtons.forEach(function (div) {
        div.style.pointerEvents = 'none';
    });
    nextButton.style.display = 'inline-block'; // 「次の問題へ」ボタンを表示
}
// ✅ 追加: 成績を更新する関数
function updateScoreDisplay() {
    scoreDisplay.innerHTML = "\u6210\u7E3E: ".concat(correctCount, " / ").concat(totalCount, " \uFF08\u6B63\u7B54\u7387: ").concat(totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : "0", "%\uFF09");
}
// 「次の問題へ」ボタンにイベント登録
document.getElementById('nextButton').addEventListener('click', nextQuestion);
