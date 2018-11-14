
/*
 * Initialise all variables
 */

let cards = ['fa-diamond', 'fa-diamond',
  'fa-paper-plane-o', 'fa-paper-plane-o',
  'fa-anchor', 'fa-anchor',
  'fa-bolt', 'fa-bolt',
  'fa-cube', 'fa-cube',
  'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle',
  'fa-bomb', 'fa-bomb'];
const allCards = document.getElementById('deck');
const movesElement = document.getElementById('moves');
const starElements = document.getElementById('stars').children;
const timerElement = document.getElementById('timer');
const modalElement = document.getElementById('modal');
const statsElement = document.getElementById('stats');
let moves = 0;
let winningCards = 0;
let currentOpenCards = [];
var timer;

/*
 * Initialise game
 */

function initGame() {
  winningCards = 0;
  currentOpenCards = [];
  moves = 0;
  displayMoves();
  resetStars();
  resetTimer();
  startTimer();
  cards = shuffle(cards);
  let cardsHtml = '';
  for (let i = 0; i < cards.length; i++) {
    cardsHtml += generateHtml(cards[i]);
  }

  allCards.innerHTML = cardsHtml; // reflow and repaint here -- once!
}

function playAgain() {
  removeModalShowCss(modalElement);
  initGame();
}

initGame();

/*
 * Shuffle cards - from http://stackoverflow.com/a/2450976
 */

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * Generate card HTML
 */

function generateHtml(cardName) {
  return `<li class="card"><i class="fa ${cardName}"></i></li>`;
}

/*
 * Manipulate CSS class for a given element
 */

function setShowCardCss(element) {
  element.classList.add('open', 'show');
}

function setMatchCardCss(element) {
  element.classList.add('match');
}

function setCloseCardCss(element) {
  element.classList.remove('open', 'show');
}

function setNoMatchCss(element) {
  element.classList.add('no-match');
}

function removeNoMatchCss(element) {
  element.classList.remove('no-match');
}

function setNoStarCss(element) {
  element.classList.add('no-star');
}

function removeNoStarCss(element) {
  element.classList.remove('no-star');
}

function setModalShowCss(element) {
  element.classList.add('show');
}

function removeModalShowCss(element) {
  element.classList.remove('show');
}

/*
 * Manipulate CSS for the two opened cards together
 */

function matchTwoCards() {
  currentOpenCards.forEach(ele => setMatchCardCss(ele));
}

function closeTwoCards() {
  currentOpenCards.forEach(ele => setCloseCardCss(ele));
}

function twoCardsNoMatch() {
  currentOpenCards.forEach(ele => setNoMatchCss(ele));
}

function twoCardsNoMatchRemove() {
  currentOpenCards.forEach(ele => removeNoMatchCss(ele));
}

/*
 * Move Counter
 */

function displayMoves() {
  movesElement.innerHTML = moves;
}

function incrementMoveCounter() {
  moves += 1;
}

/*
 * Star Rating
 */

function resetStars() {
  for (let i = 0; i < starElements.length; i++) {
    removeNoStarCss(starElements[i]);
  }
}

function setStarRating() {
  if (20 < moves && moves <= 32) setNoStarCss(starElements[2]);
  if (moves > 32) setNoStarCss(starElements[1]);
}

/*
 * Timer
 */

function resetTimer() {
  timerElement.innerHTML = '00:00';
}

function startTimer() {
  timer = setInterval(function () {
    const time = timerElement.innerHTML;
    const ss = time.split(":");
    const dt = new Date();
    dt.setHours(0);
    dt.setMinutes(ss[0]);
    dt.setSeconds(ss[1]);

    const newDate = new Date(dt.valueOf() + 1000);
    const temp = newDate.toTimeString().split(" ");
    const ts = temp[0].split(":");

    timerElement.innerHTML = ts[1] + ":" + ts[2];
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

/*
 * Congratulations Popup
 */

function showCongrats() {
  let noStar = 0;
  for (let i = 0; i < starElements.length; i++) {
    if (starElements[i].classList.contains('no-star')) noStar++;
  }
  statsElement.innerHTML = `with ${moves} moves and ${3 - noStar} star in ${timerElement.innerHTML}`;
  setModalShowCss(modalElement);
}

/*
 * Compare two cards
 */

function compareTwoCards() {
  if (areTwoCardsSame()) {
    matchTwoCards();
    winningCards++;
    currentOpenCards = [];
    if (winningCards === 8) {
      stopTimer();
      showCongrats();
    }
  } else {
    twoCardsNoMatch();
    setTimeout(() => {
      twoCardsNoMatchRemove();
      closeTwoCards();
      currentOpenCards = [];
    }, 800);
  }
}

function areTwoCardsSame() {
  return currentOpenCards[0].firstElementChild.classList[1] === currentOpenCards[1].firstElementChild.classList[1];
}

/*
 * Validate cards - do not react to already opened cards
 */

function isValidCard(element) {
  return !(element.classList.contains('open') || element.classList.contains('match'))
}

/*
 * Set of steps that need to performed when a new card is opened
 */

function performSteps(element) {
  incrementMoveCounter();
  displayMoves();
  setStarRating();
  setShowCardCss(element);
}

/*
 * Handle card click event
 */

allCards.addEventListener('click', function (event) {
  if (event.target.nodeName === 'LI' && isValidCard(event.target)) {
    currentOpenCards.push(event.target);
    if (currentOpenCards.length < 3) {
      performSteps(event.target);
      if (currentOpenCards.length === 2) {
        compareTwoCards();
      }
    }
  }
});
