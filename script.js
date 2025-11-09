const correctWords = ["quick", "jumps", "was", "day", "played", "sang", "calm"];
let blanks = document.querySelector("#paragraph p").innerHTML.split("____");
let answerIndex = 0;
let selectedWord = "";

// Arrange words evenly in a perfect circle
const words = document.querySelectorAll(".word");
const radius = 160; // circle size
const centerX = 200;
const centerY = 200;

words.forEach((word, index) => {
  const angle = (index * (2 * Math.PI)) / words.length; // evenly spaced
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  word.style.left = `${x}px`;
  word.style.top = `${y}px`;
  word.style.transform = "translate(-50%, -50%)";
});

// Word selection
document.querySelectorAll(".word").forEach((wordBtn) => {
  wordBtn.addEventListener("click", () => {
    selectedWord = wordBtn.innerText;
    document
      .querySelectorAll(".word")
      .forEach((w) => w.classList.remove("selected"));
    wordBtn.classList.add("selected");
    document.getElementById(
      "result"
    ).innerText = `🎯 You selected: "${selectedWord}"`;
  });
});

// ✅ FIX: Remove extra dash after inserting correct word
function checkAnswer(word) {
  if (word === correctWords[answerIndex]) {
    blanks[answerIndex] = blanks[answerIndex].trimEnd() + `<b>${word}</b>`; // insert word cleanly
    const updatedParagraph =
      blanks.slice(0, answerIndex + 1).join(" ") +
      " " +
      blanks.slice(answerIndex + 1).join("____");
    document.querySelector("#paragraph p").innerHTML = updatedParagraph.trim();
    document.getElementById(
      "result"
    ).innerText = `✅ Correct! "${word}" filled.`;
    answerIndex++;
  } else {
    document.getElementById("result").innerText = `❌ Wrong word! Try again.`;
  }

  if (answerIndex === correctWords.length) {
    document.getElementById("result").innerText =
      "🏆 Congratulations! You completed the paragraph!";
  }
  selectedWord = "";
}

// 🎯 Shoot arrow vertically from above the button
document.getElementById("shootButton").addEventListener("click", () => {
  if (selectedWord === "") {
    document.getElementById("result").innerText = "⚠️ Select a word first!";
    return;
  }

  const targetWord = Array.from(document.querySelectorAll(".word")).find(
    (w) => w.innerText === selectedWord
  );
  if (!targetWord) return;

  const targetRect = targetWord.getBoundingClientRect();
  const buttonRect = document
    .getElementById("shootButton")
    .getBoundingClientRect();

  // Create arrow
  const arrow = document.createElement("div");
  arrow.classList.add("shooting-arrow-vertical");
  document.body.appendChild(arrow);

  // Start position: just above Shoot Arrow button (centered)
  const startX = buttonRect.left + buttonRect.width / 2;
  const startY = buttonRect.top - 20; // 20px above button

  // ✅ End slightly closer so arrowhead touches the word
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2 + 10; // small +10 offset so tip touches

  arrow.style.left = `${startX}px`;
  arrow.style.top = `${startY}px`;

  // ✅ Rotate arrow upward (so head faces up)
  arrow.style.transform = "translateX(-50%) rotate(180deg)";

  // Animate straight up
  arrow.animate(
    [
      { top: `${startY}px`, left: `${startX}px` },
      { top: `${endY}px`, left: `${endX}px` },
    ],
    {
      duration: 900,
      easing: "linear",
      fill: "forwards",
    }
  );

  setTimeout(() => {
    arrow.remove();

    // Flash the hit word
    targetWord.classList.add("hit");
    setTimeout(() => targetWord.classList.remove("hit"), 600);

    checkAnswer(selectedWord);
  }, 900);
});

// ✅ ADDITION: handle Next button for 2nd paragraph using same 12 words
document.getElementById("nextButton").addEventListener("click", () => {
  // new paragraph text
  const newParagraph =
    "The ____ dog ____ across the park. It ____ a fun ____ where children ____ and birds ____.";

  // update the paragraph
  document.querySelector("#paragraph p").innerHTML = newParagraph;

  // ✅ set new correct words (from the same 12)
  correctWords.splice(
    0,
    correctWords.length,
    "slow",
    "walk",
    "was",
    "day",
    "played",
    "sang"
  );

  // reset tracking variables
  blanks = document.querySelector("#paragraph p").innerHTML.split("____");
  answerIndex = 0;
  selectedWord = "";
  document.getElementById("result").innerText = "🌟 New paragraph loaded!";

  // now the same Shoot Arrow button logic will work with the new correct words
});
