const things = ['', '🌱','🪴','🌳','⛺️','🎪','🏫','🏯','🛸'];
const mapSize = 5;
const confettiThreshold = 7;

let toPlace = 1;
let toCheck = 0;
let score = 0;
let maxAchieved = 1;

let map = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0]
]

let check = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
]

const draw = () => {
  const random = Math.random();
  if (random < 0.5) {
    toPlace = 1;
  } else if (random < 0.875) {
    toPlace = 2;
  } else if (random < 0.95) {
    toPlace = 3;
  } else {
    toPlace = 4;
  }

  const rows = document.querySelectorAll('.row');

  rows.forEach((row, indexRow) => {
    const tiles = row.querySelectorAll('.tile');

    tiles.forEach((tile, indexTile) => {
      tile.innerHTML = things[map[indexRow][indexTile]];
    })
  })

  const toPlaceIndicator = document.querySelector('.to-place');
  toPlaceIndicator.innerHTML = things[toPlace];

  const scoreElement = document.querySelector('.score');
  scoreElement.innerHTML = score;


  let empty = 0;
  map.forEach((row) => {
    row.forEach((tile) => {
      if (tile === 0) {
        empty++;
      }
    })
  })

  if (empty === 0) {
    const scoreHolder = document.querySelector('.score-holder');
    scoreHolder.innerHTML = `Game over! Score: (${score})`;
  }
}

const updateMaxAchieved = () => {
  let max = 0;

  map.forEach((row) => {
    row.forEach((tile) => {
      if (tile > max) {
        max = tile;
      }
    })
  })

  if (max > maxAchieved) {
    if (maxAchieved < confettiThreshold && max >= confettiThreshold) {
      fireConfetti();
    }
    maxAchieved = max;
  }
}

const init = () => {
  const rows = document.querySelectorAll('.row');
  rows.forEach((row, indexRow) => {
    const tiles = row.querySelectorAll('.tile');

    tiles.forEach((tile, indexTile) => {

      tile.addEventListener('click', () => {
        place(indexRow, indexTile);
      })
    })
  })
}

const place = (x, y) => {
  score++;

  if (map[x][y] === 0) {
    check = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];

    check[x][y] = 1;

    searchMap(toPlace);

    if (sum() >= 3) {
      check.forEach((_i, indexX) => {
        _i.forEach((_j, indexY) => {
          if (check[indexX][indexY] === 1) {
            map[indexX][indexY] = 0;
          }
        })
      })
      map[x][y] = toPlace + 1;
      checkPosition(x, y);
    } else {
      map[x][y] = toPlace;
    }

    draw();
    updateMaxAchieved();
  }
}

const searchMap = (val) => {
  // TODO: This is easy to debug, but inefficient...
  for (let i = 0; i < 10; i++) {
    for (let x = 0; x < mapSize; x++) {
      for (let y = 0; y < mapSize; y++) {
        if (map[x][y] === val) {
            if (x < (mapSize - 1) && check[x + 1][y] === 1) {
              check[x][y] = 1;
            }
            if (y < (mapSize - 1) && check[x][y + 1] === 1) {
              check[x][y] = 1;
            }
            if (x > 0 && check[x - 1][y] === 1) {
              check[x][y] = 1;
            }
            if (y > 0 && check[x][y - 1] === 1) {
              check[x][y] = 1;
            }
        }
      }
    }
  }
}

const checkPosition = (x, y) => {
toCheck = map[x][y];

check = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
];

check[x][y] = 1;

searchMap(toCheck);

if (sum() >= 3) {
  check.forEach((_i, indexX) => {
    _i.forEach((_j, indexY) => {
      if (check[indexX][indexY] === 1) {
        map[indexX][indexY] = 0;
      }
    })
  })
  map[x][y] = toCheck + 1;

  checkPosition(x, y);
} else {
  map[x][y] = toCheck;
}
}

const sum = () => {
  let sum = 0;

  check.forEach((_i, i) => {
    _i.forEach((_j, j) => {
      sum += check[i][j];
    })
  })

  return sum;
}

const fireConfetti = () => {
  var duration = 10 * 1000; // 10 seconds
  var animationEnd = Date.now() + duration;
  var skew = 1;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    var timeLeft = animationEnd - Date.now();
    var ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        y: (Math.random() * skew) - 0.2
      },
      colors: ['#ff2e24'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4)
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  }());
}

init();
draw();
