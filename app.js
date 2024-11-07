// Oyun tahtası, bilgi ekranı ve skor ekranı divlerini seçiyoruz
const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const çemberScoreDisplay = document.querySelector("#çemberScore");
const çarpıScoreDisplay = document.querySelector("#çarpıScore");
const scoreBoard = document.querySelector("#scoreBoard");

// Kazanma sayımlarını yerel depolamadan alıyoruz veya yoksa sıfırdan başlatıyoruz
let winCounts = JSON.parse(localStorage.getItem('winCounts')) || { çember: 0, çarpı: 0 };

// Oyun hücrelerini başlangıç durumu olarak tanımlıyoruz (boş)
const startCells = ["", "", "", "", "", "", "", "", ""];

// Oyun bitiş bayrağını tanımlıyoruz
let isGameOver = false;

// Hangi oyuncunun sırada olduğunu belirten değişken (başlangıçta çember)
let go = "çember";

// Bilgilendirme metnini ayarlıyoruz
infoDisplay.textContent = "ilk hamle çemberin";

// Oyun tahtasını oluşturma fonksiyonu
function createBoard() {
  // Başlangıç hücrelerini döngüyle geçiyoruz
  startCells.forEach((_cell, index) => {
    // Her hücre için bir div oluşturuyoruz ve stil veriyoruz
    const cellElement = document.createElement("div");
    cellElement.classList.add("square");
    cellElement.id = index;

    // Hücreye tıklama olayını ekliyoruz
    cellElement.addEventListener("click", addGo);

    // Hücreyi oyun tahtasına ekliyoruz
    gameBoard.append(cellElement);
  });
}

// Oyun tahtasını oluşturma fonksiyonunu çağırıyoruz
createBoard();

// Skor tahtasını güncelliyoruz
updateScoreboard();

// Hücreye tıklandığında çalışacak fonksiyon
function addGo(e) {
  // Oyun bittiyse tıklamayı engelliyoruz
   if (isGameOver) return;

  // Yeni bir div oluşturup ilgili sınıfı ekliyoruz (çember veya çarpı)
  const goDisplay = document.createElement("div");
  goDisplay.classList.add(go);

  // Bu div'i tıklanan hücreye ekliyoruz
  e.target.append(goDisplay);

  // Sıradaki oyuncuyu değiştiriyoruz
  go = go === "çember" ? "çarpı" : "çember";

  // Bilgilendirme metnini güncelliyoruz
  infoDisplay.textContent = "şimdi  " + go + "'ın sırası";

  // Tıklanan hücrenin tıklama olayını kaldırıyoruz
  e.target.removeEventListener("click", addGo);
   
  // Skoru kontrol ediyoruz
  checkScore();
}

// Skoru kontrol eden fonksiyon
function checkScore() {
  // Tüm hücreleri seçiyoruz
  const allSquares = document.querySelectorAll(".square");

  // Kazanma kombinasyonlarını tanımlıyoruz
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // Kazanma durumlarını belirleyen değişkenler
  let çemberWins = false;
  let çarpıWins = false;
  // Kazanma kombinasyonlarını kontrol ediyoruz (çember için)
  winningCombos.forEach(array => {
    const çemberWin = array.every(cell => 
      allSquares[cell].firstChild?.classList.contains("çember"));
    if (çemberWin) {
      çemberWins = true;
      infoDisplay.textContent = "çember kazandı!";
      winCounts.çember += 1;
      updateLocalStorage();
      updateScoreboard();
      isGameOver = true; // Oyun bitti

      // setTimeout(resetBoard, 2000); // 2 saniye bekle, sonra tahtayı sıfırla
    }
  });

  // Kazanma kombinasyonlarını kontrol ediyoruz (çarpı için)
  winningCombos.forEach(array => {
    const çarpıWin = array.every(cell => 
      allSquares[cell].firstChild?.classList.contains("çarpı"));
    if (çarpıWin) {
      çarpıWins = true;
      infoDisplay.textContent = "çarpı kazandı!";
      winCounts.çarpı += 1;
      updateLocalStorage();
      updateScoreboard();
      isGameOver = true; // Oyun bitti

      // setTimeout(resetBoard, 2000); // 2 saniye bekle, sonra tahtayı sıfırla
    }
  });

  // Eğer kimse kazanmamışsa ve tüm hücreler doluysa berabere olduğunu belirtiyoruz
  if (!çemberWins && !çarpıWins) {
    const allFilled = Array.from(allSquares).every(square => square.firstChild);
    if (allFilled) {
      infoDisplay.textContent = "Berabere!";
      setTimeout(resetBoard, 2000); // 2 saniye bekle, sonra tahtayı sıfırla
    }
  }
}


// Oyun tahtasını sıfırlayan fonksiyon
function resetBoard() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
  go = "çember";
  infoDisplay.textContent = "ilk hamle çemberin";
}

// Kazanma sayımlarını yerel depolamaya kaydeden fonksiyon
function updateLocalStorage() {
  localStorage.setItem('winCounts', JSON.stringify(winCounts));
}

// Skor tahtasını güncelleyen fonksiyon
function updateScoreboard() {
  scoreBoard.textContent = `çember kazandı: ${winCounts.çember} | çarpı Wins: ${winCounts.çarpı}`;
}
