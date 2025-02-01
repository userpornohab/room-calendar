const calendarElement1 = document.getElementById('calendar1');
const calendarElement2 = document.getElementById('calendar2');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const clearBtn = document.getElementById('clearBtn');
const guestsInput = document.getElementById('guestsInput');
const plusBtn = document.querySelector('.plus-btn');
const minusBtn = document.querySelector('.minus-btn');
const calendarsContainer = document.querySelector('.calendars');



let startDate = null;
let endDate = null;
let hoverEndDate = null;

let currentYear;
let currentMonth;

const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

function initCalendar() {
    const currentDate = new Date();
    currentYear = currentDate.getFullYear();
    currentMonth = currentDate.getMonth();

    populateMonthSelect();
    populateYearSelect();
    updateSelects();
    updateMonthOptions();
    refreshCalendars();
    updateNavButtons();
}

function populateMonthSelect() {
    months.forEach((month, index) => {
        const monthOption = document.createElement('div');
        monthOption.className = 'month-option';
        monthOption.dataset.value = index;
        monthOption.textContent = month;
        monthSelect.appendChild(monthOption);
    });
}

function populateYearSelect() {
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';
    for (let i = currentYear; i <= currentYear + 2; i++) {
        const yearOption = document.createElement('div');
        yearOption.className = 'year-option' + (i > currentYear + 2 ? ' disabled' : '');
        yearOption.dataset.value = i;
        yearOption.textContent = i;
        yearSelect.appendChild(yearOption);
    }
}

function updateMonthOptions() {
    const currentDate = new Date();
    const currentYearNow = currentDate.getFullYear();
    const currentMonthNow = currentDate.getMonth();
    
    document.querySelectorAll('.month-option').forEach(option => {
        const month = parseInt(option.dataset.value);
        let isDisabled = false;
        
        if (currentYear < currentYearNow) {
            isDisabled = true;
        } else if (currentYear === currentYearNow) {
            isDisabled = month < currentMonthNow;
        } else if (currentYear === currentYearNow + 2) {
            isDisabled = month > currentMonthNow;
        } else if (currentYear > currentYearNow + 2) {
            isDisabled = true;
        }
        
        option.classList.toggle('disabled', isDisabled);
    });
}

function createCalendar(year, month, element) {
    element.innerHTML = '';
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar';

    ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
        const weekday = document.createElement('div');
        weekday.className = 'weekday';
        weekday.textContent = day;
        calendarGrid.appendChild(weekday);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptyCells = (firstDay + 6) % 7;

    for (let i = 0; i < emptyCells; i++) {
        const empty = document.createElement('div');
        empty.className = 'day empty';
        calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        dayElement.dataset.year = year;
        dayElement.dataset.month = month;
        dayElement.dataset.day = day;

        dayElement.addEventListener('click', () => selectDate(year, month, day));
        dayElement.addEventListener('mouseover', () => handleHover(year, month, day));

        calendarGrid.appendChild(dayElement);
    }

    element.appendChild(calendarGrid);
}

function refreshCalendars() {
    clearPreviousSelection();
    createCalendar(currentYear, currentMonth, calendarElement1);
    document.getElementById('monthTitle1').textContent = `${months[currentMonth]} ${currentYear}`;

    let nextYear = currentYear;
    let nextMonth = currentMonth + 1;
    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
    }
    createCalendar(nextYear, nextMonth, calendarElement2);
    document.getElementById('monthTitle2').textContent = `${months[nextMonth]} ${nextYear}`;

    if (startDate) highlightRange(startDate, endDate || hoverEndDate);
}

function isPastMonth(year, month) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    return year < currentYear || (year === currentYear && month <= currentMonth);
}

function isFutureLimit(year, month) {
    const currentDate = new Date();
    const selectedDate = new Date(year, month);
    const futureLimit = new Date(currentDate.getFullYear() + 2, currentDate.getMonth() - 1);
    return selectedDate > futureLimit;
}

function updatePrevButtonVisibility() {
    if (isPastMonth(currentYear, currentMonth)) {
        document.querySelector('.nav-btn-start').classList.remove('visible');
    } else {
        document.querySelector('.nav-btn-start').classList.add('visible');
    }
}

function updateNextButtonVisibility() {
    if (isFutureLimit(currentYear, currentMonth)) {
        document.querySelector('.nav-btn-end').classList.add('nevisible');
    } else {
        document.querySelector('.nav-btn-end').classList.remove('nevisible');
    }
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    }

    updatePrevButtonVisibility();
    updateNextButtonVisibility();
    refreshCalendars();
    updateSelects();
    updateMonthOptions();
}

function updateSelects() {
    const selectedMonth = monthSelect.querySelector('.selected');
    if (selectedMonth) {
        selectedMonth.classList.remove('selected');
    }
    monthSelect.querySelector(`[data-value="${currentMonth}"]`).classList.add('selected');

    const selectedYear = yearSelect.querySelector('.selected');
    if (selectedYear) {
        selectedYear.classList.remove('selected');
    }
    yearSelect.querySelector(`[data-value="${currentYear}"]`).classList.add('selected');
}

monthSelect.addEventListener('click', (event) => {
    if (event.target.classList.contains('month-option') && !event.target.classList.contains('disabled')) {
        currentMonth = parseInt(event.target.getAttribute('data-value'));
        refreshCalendars();
        updateSelects();
        updatePrevButtonVisibility();
        updateNextButtonVisibility();
    }
});

yearSelect.addEventListener('click', (event) => {
    if (event.target.classList.contains('year-option') && !event.target.classList.contains('disabled')) {
        currentYear = parseInt(event.target.getAttribute('data-value'));
        refreshCalendars();
        updateSelects();
        updateMonthOptions();
        updatePrevButtonVisibility();
        updateNextButtonVisibility();
    }
});

prevBtn.addEventListener('click', () => changeMonth(-1));
nextBtn.addEventListener('click', () => changeMonth(1));

clearBtn.addEventListener('click', () => {
    resetDates();
    refreshCalendars();
});

function selectDate(year, month, day) {
    const selectedDate = new Date(year, month, day);
    
    if (!startDate || (startDate && endDate)) {
        clearPreviousSelection();
        resetDates();
        startDate = selectedDate;
        startDateInput.value = startDate.toLocaleDateString();
        highlightDay(startDate, 'start-date');
    } else if (selectedDate >= startDate) {
        endDate = selectedDate;
        endDateInput.value = endDate.toLocaleDateString();
        highlightRange(startDate, endDate);
    } else {
        clearPreviousSelection();
        resetDates();
    }
    
    updateSelectedDaysInfo(); // Добавлен вызов функции обновления
}
// Обновленный JavaScript код для гостей

function updateSelectedDaysInfo() {
    const infoElement = document.getElementById('selectedDaysInfo');
    
    function getNightsDeclension(days) {
        const lastDigit = days % 10;
        const lastTwoDigits = days % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'ночей';
        if (lastDigit ===3 ) return 'ночи';
        return 'ночей';
    }

    if (startDate && endDate) {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        infoElement.textContent = `Выбрано ${diffDays} ${getNightsDeclension(diffDays)}`;

        if (diffDays <= 2 ) {
            infoElement.textContent = 'К сожалению, текущие даты не соответствуют нашему минимальному сроку бронирования (3 ночи)';
        }

    } else if (startDate) {
        infoElement.textContent = 'Выберите дату окончания';
    } else {
        infoElement.textContent = 'Выберите начальную дату';
    }
}

let guestsCount = 1;
const MAX_GUESTS = 4;
const MIN_GUESTS = 1;

function updateGuestsDisplay() {
    guestsInput.value = `${getGuestsWordForm(guestsCount)} ${guestsCount}`;
    minusBtn.disabled = guestsCount === MIN_GUESTS;
    plusBtn.disabled = guestsCount === MAX_GUESTS;
}

function getGuestsWordForm(number) {
    if (number % 10 === 1 && number % 100 !== 11) return 'Гость';
    if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) return 'Гостя';
    return 'Гостей';
}

plusBtn.addEventListener('click', () => {
    if (guestsCount < MAX_GUESTS) {
        guestsCount++;
        updateGuestsDisplay();
    }
});

minusBtn.addEventListener('click', () => {
    if (guestsCount > MIN_GUESTS) {
        guestsCount--;
        updateGuestsDisplay();
    }
});

// Инициализация при загрузке
updateGuestsDisplay();

function handleHover(year, month, day) {
    if (startDate && !endDate) {
        const hoverDate = new Date(year, month, day);
        if (hoverDate >= startDate) {
            hoverEndDate = hoverDate;
            highlightRange(startDate, hoverEndDate);
        }
    }
}

function highlightDay(date, className) {
    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach((element) => {
        const elementDate = new Date(
            parseInt(element.getAttribute('data-year')),
            parseInt(element.getAttribute('data-month')),
            parseInt(element.textContent)
        );
        if (elementDate.getTime() === date.getTime()) {
            element.classList.add('selected', className);
        }
    });
}

function highlightRange(startDate, endDate) {
    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach((element) => {
        const elementDate = new Date(
            parseInt(element.getAttribute('data-year')),
            parseInt(element.getAttribute('data-month')),
            parseInt(element.textContent)
        );

        element.classList.remove('selected', 'start-date', 'end-date');

        if (elementDate >= startDate && elementDate <= endDate) {
            element.classList.add('selected');
            if (elementDate.getTime() === startDate.getTime()) {
                element.classList.add('start-date');
            } else if (elementDate.getTime() === endDate.getTime()) {
                element.classList.add('end-date');
            }
        }
    });
}

function clearPreviousSelection() {
    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach((element) => {
        element.classList.remove('selected', 'start-date', 'end-date');
    });
}

function resetDates() {
    startDate = null;
    endDate = null;
    hoverEndDate = null;
    startDateInput.value = '';
    endDateInput.value = '';
    document.getElementById('selectedDaysInfo').textContent = '';
}

// Обработчики для инпутов
[startDateInput, endDateInput].forEach(input => {
    input.addEventListener('click', (e) => {
        e.stopPropagation(); // Останавливаем всплытие события
        calendarsContainer.classList.add('visible');
    });
});

// Обработчик закрытия календаря
document.addEventListener('click', (event) => {
    const isCalendarClick = calendarsContainer.contains(event.target);
    const isInputClick = event.target === startDateInput || event.target === endDateInput;
    
    if (!isCalendarClick && !isInputClick) {
        calendarsContainer.classList.remove('visible');
    }
});


// Закрытие при нажатии Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        calendarsContainer.classList.remove('visible');
    }
});

initCalendar();