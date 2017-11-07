//  utils
function getRandom(min, max, excl) {
	let random = Math.round(Math.random() * (max - min) + min);
	if (excl && excl.indexOf(random) !== -1) {
		return getRandom(min, max, excl);
	}
	return random;
}



initControlsPopup();

initGame();



function initGame() {
	const gameField = document.querySelector('.js_game'),
		  gameCells = gameField.querySelectorAll('.js_game_cell');

	let currentArray = [];

	bindEvents();
	nextRound();


	function getGameValues() {
		let count = 6,
			arr = [];

		for (let i = 0; i < count; i++) {
			arr[i] = getRandom(1, 55, arr);
		}

		return arr;
	}

	function fillGameField(array) {
		let i = 0,
			excl = [];

		while (i < array.length) {
			let index = getRandom(0, gameCells.length - 1, excl),
				cell = gameCells[index];
			excl.push(index);

			cell.dataset.value = array[i];
			cell.innerText = array[i];
			cell.classList.add('filled');
			i++;
		}
	}

	function clearGameField() {
		Array.prototype.forEach.call(gameCells, function(cell){
			cell.dataset.value = '';
			cell.innerText = '';
			cell.classList.remove('solved');
			cell.classList.remove('error');
			cell.classList.remove('success');
			cell.classList.remove('filled');
		});

		gameField.classList.remove('hard-mode');
	}

	function test(value) {
		return value === currentArray[0];
	}

	function nextRound() {
		currentArray = getGameValues().sort((a,b) => {return a-b});
		console.log(currentArray);

		clearGameField();
		fillGameField(currentArray);
	}

	function userAct(value, cell) {
		let right = test(value);

		if (right) {
			cell.classList.add('solved');
			currentArray = currentArray.slice(1);

			if (currentArray.length === 0) {
				cell.classList.add('success');
				setTimeout(() => {
					nextRound();
				}, 300)
			}
		} else {
			cell.classList.add('error');

			setTimeout(() => {
				nextRound();
			}, 300);
		}
	}

	function bindEvents() {
		gameField.addEventListener('mousedown', (e) => {
			let target = e.target;

			if (target.classList.contains('js_game_cell')) {
				let value = target.dataset.value;
				if (!value) return;

				value = +value;
				userAct(value, target);
			}
		});

		document.querySelector('.js_hm').addEventListener('click', () => {
			gameField.classList.add('hard-mode');
		})

		document.addEventListener('keypress', (e) => {
			if (e.keyCode === 32) {
				gameField.classList.add('hard-mode');
			}
		})
	}
}







function initControlsPopup() {
	const controlsButton = document.querySelector('.js_open_controls'),
		  controlsPopup = document.querySelector('.js_controls');

	bindEvents();

	function toggleControls() {
		controlsPopup.classList.toggle('visible');
	}

	function bindEvents() {
		document.addEventListener('click', function(e){
			const target = e.target;

			if (target === controlsButton || target.closest('.js_open_controls') === controlsButton) {
				toggleControls();
			}
		});
	}
}