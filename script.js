'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Malin Samaranayake',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-01-25T21:31:17.178Z',
    '2021-01-28T07:42:02.383Z',
    '2021-01-27T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Melanie Meixner',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// building the app

const formatMovementDates = function (asOfDate, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.floor(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));

  // const asOfYear = asOfDate.getFullYear();
  // const asOfMonth = `${asOfDate.getMonth() + 1}`.padStart(2, 0);
  // const asOfDatee = `${asOfDate.getDate()}`.padStart(2, 0);

  const daysDiff = calcDaysPassed(new Date(), asOfDate);
  // console.log(daysDiff);

  if (daysDiff > 10) return Intl.DateTimeFormat(locale).format(asOfDate);
  else if (daysDiff === 0) return 'Today';
  else if (daysDiff === 1) return 'Yesterday';
  else {
    return `${daysDiff} days back`;
  }
};

const formatCurr = function (val, locale, cur) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur,
  }).format(val);
};

//populatingMovements
const populateMovements = function (acc, sort = false) {
  const movements = acc.movements;

  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  const movOptions = {
    style: 'currency',
    currency: acc.currency,
  };

  movs.forEach(function (mov, i) {
    const asOfDate = new Date(acc.movementsDates[i]);

    const movDate = formatMovementDates(asOfDate, acc.locale);

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row" style="background-color:${
      i % 2 === 0 ? '#f3f3f3' : '#ffffff'
    } ">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${movDate}</div>
      <div class="movements__value">${formatCurr(
        mov,
        acc.locale,
        acc.currency
      )}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    // console.log(containerMovements.innerHTML); // this gets the html withing the tag
  });
};

const calcDisplayBalance = function (acc) {
  const sum = acc.movements.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  acc.balance = sum;
  labelBalance.textContent = `${formatCurr(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
  // console.log(sum);
};

const calcDisplaySummary = function (account) {
  const movement = account.movements;
  const depositsSum = movement
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${formatCurr(
    depositsSum,
    account.locale,
    account.currency
  )}`;

  const widthralSum = movement
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${formatCurr(
    widthralSum,
    account.locale,
    account.currency
  )}`;

  const interestSum = movement
    .filter(val => val > 0)
    .map(val => val * (account.interestRate / 100))
    .filter(val => val >= 1)
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = `${formatCurr(
    interestSum,
    account.locale,
    account.currency
  )}`;

  // console.log(widthralSum);
};

const computeUserName = user =>
  user
    .toLowerCase()
    .split(' ')
    .map((name, i) => name[0])
    .join('');

accounts.forEach(function (acc) {
  acc.username = computeUserName(acc.owner);
});
// this forEach loop has the side effect (do something without returning anything).
// it mutates each object

// console.log(accounts);

const logoutTimer = function () {
  const tick = () => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };

  let time = 30;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//login
let currentAccount, timer;

const updateUI = function (acc) {
  console.log('ui called');
  populateMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

//fake always login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
// fake end

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    val => val.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    //assignment operator evaluates from right to left
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = logoutTimer();

    const asOfDate = new Date();

    // const asOfYear = asOfDate.getFullYear();
    // const asOfMonth = `${asOfDate.getMonth() + 1}`.padStart(2, 0);
    // const asOfDatee = `${asOfDate.getDate()}`.padStart(2, 0);
    // const asOfHour = asOfDate.getHours();
    // const asOfMinute = asOfDate.getMinutes();

    const asOfDateOptions = {
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'long',
      minute: 'numeric',
      hour: 'numeric',
    };

    const asOfDateFormatted = Intl.DateTimeFormat(
      currentAccount.locale,
      asOfDateOptions
    ).format(asOfDate);

    labelDate.textContent = asOfDateFormatted;
    // labelDate.textContent = `${asOfDate.getFullYear}`;

    updateUI(currentAccount);
  }

  console.log(currentAccount);
});

// tranfer money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = +inputTransferAmount.value;
  const transferToAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

  // let curBalance = currentAccount.movements.reduce((acc, val) => acc + val);
  if (
    currentAccount.balance >= transferAmount &&
    transferToAcc &&
    transferToAcc !== currentAccount &&
    transferAmount > 0
  ) {
    currentAccount?.movements.push(-transferAmount);
    transferToAcc?.movements.push(transferAmount);
    currentAccount?.movementsDates.push(new Date().toISOString());
    transferToAcc?.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }

  if (timer) clearInterval(timer);
  timer = logoutTimer();
});

// request a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  let eligible;
  if (amount > 0) {
    eligible = currentAccount.movements.some(val => val >= amount * 0.1);
  }

  if (eligible) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  // console.log(eligible);

  if (timer) clearInterval(timer);
  timer = logoutTimer();
});

// delete account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();
  }
});

// sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  populateMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

console.log(`---------------- numbers ----------`);

console.log(0.2 + 0.2); // 0.4
console.log(0.1 + 0.2); // 0.30000000000000004
// this behaviour is due to the way javascript represent numbers
//so
console.log(0.1 + 0.2 === 0.3); // false

//convertion
console.log(Number('23'));
console.log(+'23');

//parsing
console.log(Number.parseInt('100px')); //100
console.log(Number.parseInt('100px', 10)); //second parameter implies base 10 (radix), it is a good practice to always use the radix

console.log(Number.parseInt('2.25rem', 10)); // 2
console.log(Number.parseFloat('2.25rem', 10)); // 2.25

console.log(parseFloat('2.25rem', 10)); // this also works
// because parseFloat, parseInt are global function
// but its encouraged to use Number.parseFloat()
// because Number provides a namespace

//Number.isNaN
console.log(Number.isNaN(25)); // false
console.log(Number.isNaN('25')); // false
console.log(Number.isNaN(+'sad')); // true
console.log(Number.isNaN(25 / 0)); // false

//Number.isInfinite - better solution than isNan
console.log(Number.isFinite(25)); // true
console.log(Number.isFinite('25')); // false
console.log(Number.isFinite(+'d25')); // false
console.log(Number.isFinite(25 / 0)); // false

//isInteger
console.log(Number.isInteger(25)); // true
console.log(Number.isInteger(25.0)); // true
console.log(Number.isInteger(25.1)); // false

//MAth functions
console.log(Math.sqrt(25)); // 5
console.log(25 ** (1 / 2)); // 5 - similar to sqrt
console.log(8 ** (1 / 3)); // 2 cubic root

console.log(Math.max(1, 25, 4, '8', 78, 56)); // 78 - do data  coercion, but does not parse
console.log(Math.min(1, 25, 4, '8', 78, 56)); // 1 - do data  coercion, but does not parse

console.log(Math.PI); // 3.141592653589793

console.log(Math.random());

const randInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

console.log(randInt(5, 10));

//rounding integers
console.log(Math.round('23.5')); // 24 // do type coercion
console.log(Math.ceil('23.4')); // 24 // do type coercion
console.log(Math.floor(23.9)); // 23 // do type coercion

console.log(Math.floor(-23.9)); //
console.log(Math.trunc(-23.9)); //

//rounding decimals
console.log((23.4).toFixed(0)); // 23 // toFixed() returns a string
console.log((23.7).toFixed(0)); // 24
console.log(+(23.7).toFixed(3)); // 24.700

//remeinder operator
console.log(5 % 2); // 1
console.log('8' % '3'); // 2

const isEven = val => val % 2 === 0;

console.log(isEven(8)); // true
console.log(isEven(9)); // false

console.log(`---------------- numbers end ----------`);
/////////////////////////////////////////////////
// bigInt
console.log(`---------------- bigInt ----------`);

console.log(2 ** 53 - 1); // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER); //9007199254740991
//9007199254740991 is the highest number, java script can safly represent

console.log(9007199254740991n * 2n); // this is bigInt // 18014398509481982
console.log(BigInt(25)); // 25n
// console.log(BigInt(25) * 2); // error, cannot mix BigInt with other types
// console.log(BigInt(25.25)); // error

console.log(25n > 30); // false
console.log(25n === 25); // false, different types
console.log(25n + ' is twenty five bigInt');
console.log(`${25n} is twenty five bigInt`);

// console.log(Math.sqrt(16n)); // error // Cannot convert a BigInt value to a numbe

console.log(+'25n '); // NaN
console.log(10 / 3); // 3.33333
console.log(10n / 3n); // 3n

console.log(`---------------- bigInt ----------`);
/////////////////////////////////////////////////
console.log(`---------------- dates ----------`);

const now = new Date();
console.log(now);
console.log(new Date('Thu Jan 28 2021 10:33:11'));
console.log(new Date('24 April, 2018')); // Tue Apr 24 2018 00:00:00 GMT+0200 (Central European Summer Time) // it works, but not recommended

console.log(account1.movementsDates[0]);

console.log(new Date(2021, 10, 29, 4, 15, 35)); //Mon Nov 29 2021 04:15:35 GMT+0100 (Central European Standard Time)
// notice, month no 10, but month is Nov

console.log(new Date(2021, 10, 33)); //Fri Dec 03 2021 00:00:00 GMT+0100 (Central European Standard Time)
// there's no 33rd Nov, Javascript calculates that and decides, 03rd Dec

console.log(new Date(0)); // Thu Jan 01 1970 01:00:00 GMT+0100 (Central European Standard Time)
// begining of the unix time

console.log(new Date(3 * 24 * 60 * 60 * 1000)); //Sun Jan 04 1970 01:00:00 GMT+0100 (Central European Standard Time)
// 3 days after the begining of the unix time
// (3 * 24 * 60 * 60 * 1000) = 259200000 is the timestamp

const future = new Date(new Date(2021, 10, 29, 4, 15, 35));
console.log(future);

console.log(future.getFullYear());
console.log(future.getMonth()); // months are 0 based
console.log(future.getDate());
console.log(future.getDay()); // day of the week, sun is 0
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getMilliseconds());

console.log(future.getUTCMilliseconds()); // Universal cordinated Time (UTC)
// UTC methods are available to all the above methods

future.setFullYear(2022); // set methods available to all the above methods
// set methods auto correct the date when nessasary
console.log(future);

console.log(future.toISOString()); // 2022-11-29T03:15:35.000Z
// Z - default time zone (London) - one hour less than central european time

console.log(future.getTime()); // 1669691735000 // timestamp

console.log(new Date(1669691735000)); // get date from timestamp

console.log(Date.now()); // current timeStamp

// date operations
// moment.js is a library

const calcDaysPassed = (date1, date2) =>
  Math.abs(date1 - date2) / (24 * 60 * 60 * 1000);
const days1 = calcDaysPassed(new Date(2021, 1, 5), new Date(2021, 1, 10));
console.log(days1);

console.log(`---------------- dates end ----------`);
/////////////////////////////////////////////////
console.log(`---------------- internationalization api ----------`);

// date

const nowDate = new Date();
console.log(nowDate); // Thu Jan 28 2021 19:47:29 GMT+0100 (Central European Standard Time
const nowDateFormatted = Intl.DateTimeFormat('de-DE').format(nowDate);
console.log(nowDateFormatted); // 28.1.2021

const nowDateOptions = {
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
};

const nowDateFormatted2 = Intl.DateTimeFormat('de-DE', nowDateOptions).format(
  nowDate
);

console.log(nowDateFormatted2);

const locale = navigator.language;
console.log(locale); // en-GB

const nowDateFormatted3 = Intl.DateTimeFormat(locale, nowDateOptions).format(
  nowDate
);

console.log(nowDateFormatted3);

//iso language code table
// http://www.lingoes.net/en/translator/langcode.htm

//number

const num = 3456987.54;

console.log('US', new Intl.NumberFormat('en-US').format(num));
console.log('Germany', new Intl.NumberFormat('de-DE').format(num));
console.log('Syria', new Intl.NumberFormat('ar-SY').format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(num)
);

let numOptions = {
  style: 'unit',
  unit: 'mile-per-hour',
  // unit: 'celsius',
};

console.log('US', new Intl.NumberFormat('en-US', numOptions).format(num));
console.log('Germany', new Intl.NumberFormat('de-DE', numOptions).format(num));

numOptions = {
  style: 'percent',
};

console.log('US', new Intl.NumberFormat('en-US', numOptions).format(num));
console.log('Germany', new Intl.NumberFormat('de-DE', numOptions).format(num));

numOptions = {
  style: 'currency',
  currency: 'EUR',
  // useGrouping: false,
};

console.log('US', new Intl.NumberFormat('en-US', numOptions).format(num));
console.log('Germany', new Intl.NumberFormat('de-DE', numOptions).format(num));

console.log(`---------------- internationalization api end ----------`);
/////////////////////////////////////////////////
// timers
console.log(`---------------- timers ----------`);

//setTimeout
setTimeout(() => console.log('this prints after 3 seconds'), 3000);

setTimeout(
  (arg1, arg2) =>
    console.log(`this prints after 3 seconds with ${arg1} and ${arg2}`),
  3000,
  'Melanie',
  'Malin'
);

const timerArgs = ['Melanie', 'Malin'];

const myTimer = setTimeout(
  (arg1, arg2) =>
    console.log(`this prints after 3 seconds with ${arg1} and ${arg2}`),
  3000,
  ...timerArgs
);

if (timerArgs.includes('Malin')) clearTimeout(myTimer); // canceling the timer

//setInterval

// setInterval(() => {
//   const now = new Date();

//   console.log(`${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`);
// }, 1000);

console.log(`---------------- timers end ----------`);
/////////////////////////////////////////////////
