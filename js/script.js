//Основная функция фильтрации,в которой мы принимаем тип данных из селектора, и неограниченное количество значений из инпута,сама функция же возвращает массив из значений пройденных проверку на тип данных полученных из селекта
const filterByType = (type, ...values) => values.filter(value => typeof value === type),
	//Функция скрытия всех блоков 
	hideAllResponseBlocks = () => {
		//Получаем все блоки с результатами на странице,записывая в переменную-массив
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		//Скрываем все блоки устанавливая им значение display: none;
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},
	//Функция показа нужного блока с параметрами селектора блока,нашего сообщения и нужного span
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		//Вызываем функцию скрытия всех блоков
		hideAllResponseBlocks();
		//Находим элемент на странице с нашим селектором и присваиваем ему значение display: block(показываем нужный нам блок на странице)
		document.querySelector(blockSelector).style.display = 'block';
		//Если передан span(или он существует),то мы находим на странице этот спан,и в textContent записываем наше сообщение 
		if (spanSelector) {
			document.querySelector(spanSelector).textContent = msgText;
		}
	},
	//Функция показа ошибки,которая вызывает функцию показа блока с параметром класс нужного блока,сообщением об ошибке и span с id "error"
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	//Функция показа результата,которая вызывает функцию показа блока с параметром класса нужного блока,нашим сообщением и сигнализацией того,что наше приложение отработало успешно(передает span с Id "ok")
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	//Функция показа результата,когда нет результата,которая вызывает функцию показа блока с параметром класса нужного блока
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	//Функция попытки фильтрации с параметрами type - (значение селекта) и values - (значение инпута)
	tryFilterByType = (type, values) => {
		//конструкция try/catch для отловки ошибок
		try {
			//Создаем переменную-массив и присваиваем им работу функции filterByType,куда передаем наши аргументы,функция возвращает массив,который мы собираем в строку через ", " 
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			//Создаем переменную alertMsg где проверяем на пустоту наш массив,если он != 0,то присваиваем переменной строку,где выводим наши данные,если наш массив пуст,то присваиваем переменной строку с отсутствием значений в массиве  
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
			//Передаем наше сообщение в функцию,которая выводит наше сообщение в блок с результатами
			showResults(alertMsg);
		} catch (e) {
			//Если есть какая-то ошибка,то выводим ее в блок с ошибкой,передавая ошибку как аргумент в нашу функцию
			showError(`Ошибка: ${e}`);
		}
	};
//Получаем кнопку Фильтровать
const filterButton = document.querySelector('#filter-btn');

//Вешаем событие по клику на кнопку "Фильтровать"
filterButton.addEventListener('click', e => {
	//Находим Инпут и Селект на странице
	const typeInput = document.querySelector('#type');
	const dataInput = document.querySelector('#data');

	//Проверяем на пустоту инпут
	if (dataInput.value === '') {
		//Выводим собственное сообщение,при не заполненности инпута
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		//Показываем сообщение "Пока нечего показывать" в блоке под Результаты:
		showNoResults();
	} else {
		//Если инпут не пуст,убираем собственное сообщение
		dataInput.setCustomValidity('');
		//Отменяем обычное поведение кнопки
		e.preventDefault();
		//Запускаем функцию проверки со значениями инпута и селекта в параметрах функции(предварительно убрав пробелы)
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});