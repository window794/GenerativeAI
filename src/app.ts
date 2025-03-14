type AI = {
    number: number;
    upper: string;
    lower: string;
};

let AIList: AI[] = [];
let currentAI: AI | null = null;
let correctCount = 0;
let totalCount = 0;

// 成績を表示する要素
const scoreDisplay = document.getElementById('scoreDisplay')!;

// JSONデータを読み込む
fetch('src/GenerativeAI_QA.json')
    .then(response => response.json())
    .then((data: AI[]) => {
        AIList = data;
        updateScoreDisplay(); // 初回成績表示
        nextQuestion(); // 最初の問題を表示
    });

// 次の問題を表示
function nextQuestion() {
    const upperText = document.getElementById('upperText')!;
    const choicesDiv = document.getElementById('choices')!;
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;

    result.textContent = ''; // 結果をクリア
    choicesDiv.innerHTML = ''; // 選択肢をクリア

    // ランダムに1つ選ぶ
    currentAI = AIList[Math.floor(Math.random() * AIList.length)];
    upperText.textContent = currentAI.upper;

    // 下の句を4択（正解+不正解3つ）
    const wrongChoices = AIList
        .filter(k => k.number !== currentAI!.number)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(k => k.lower);

    const allChoices = [...wrongChoices, currentAI.lower].sort(() => Math.random() - 0.5);

    allChoices.forEach(choice => {
        const choiceDiv = document.createElement('div');
        choiceDiv.textContent = choice;
        choiceDiv.classList.add('option'); // ✅ <button> ではなく <div> に変更
        choiceDiv.onclick = () => checkAnswer(choice, choiceDiv); // ✅ 選択時の動作
        choicesDiv.appendChild(choiceDiv);
    });

    nextButton.style.display = 'none'; // 「次の問題へ」ボタンを非表示
}

// 正解チェック
function checkAnswer(selected: string, selectedDiv: HTMLElement) {
    const result = document.getElementById('result')!;
    const nextButton = document.getElementById('nextButton')!;
    const choiceButtons = document.querySelectorAll('.option'); // ✅ すべての選択肢を取得

    totalCount++;

    if (selected === currentAI!.lower) {
        correctCount++;
        result.innerHTML = `正解！🎉`;
        result.style.color = 'green';
        selectedDiv.classList.add('correct'); // ✅ 正解時のスタイル追加
    } else {
        result.innerHTML = `残念！正解は「${currentAI!.lower}」`;
        result.style.color = 'red';
        selectedDiv.classList.add('wrong'); // ✅ 間違い時のスタイル追加
    }

    updateScoreDisplay();

    // ✅ すべての選択肢を無効化して、連打で正解数を稼げないようにする
    choiceButtons.forEach(div => {
        (div as HTMLDivElement).style.pointerEvents = 'none';
    });

    nextButton.style.display = 'inline-block'; // 「次の問題へ」ボタンを表示
}

// ✅ 追加: 成績を更新する関数
function updateScoreDisplay() {
    scoreDisplay.innerHTML = `成績: ${correctCount} / ${totalCount} （正答率: ${totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : "0"}%）`;
}

// 「次の問題へ」ボタンにイベント登録
document.getElementById('nextButton')!.addEventListener('click', nextQuestion);