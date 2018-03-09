// Initialize Firebase
var config = {
  apiKey: "AIzaSyCwvQEoIlNE8V_xFO4jQHeCT0L8BJvfKi8",
  authDomain: "project-hexschool-learn.firebaseapp.com",
  databaseURL: "https://project-hexschool-learn.firebaseio.com",
  projectId: "project-hexschool-learn",
  storageBucket: "project-hexschool-learn.appspot.com",
  messagingSenderId: "959693398475"
};
firebase.initializeApp(config);

var database = firebase.database();
// console.log(database); 測試是否連結firebase

var bmiData = firebase.database().ref('bmiData');

// 按送出按鈕，可以寫入到資料庫
function sendFirebase(color, calculate, height, weight, now) {
  bmiData.push({
    Color: color,
    BMI: calculate,
    kg: weight,
    cm: height,
    time: now
  })
}

// 運算
function calculateData(height, weight) {
  var resultData = weight / (height * height / 10000);
  // 取到小數第二位
  resultData = resultData.toFixed(2);
  // console.log(resultData);
  return resultData;
}

// 判斷顏色
function colorResult(calculate) {
  if (18.5 <= calculate && calculate < 24) {
    return '理想';
  }
  if (18.5 > calculate) {
    return '過輕';
  }
  if (24 >= calculate ) {
    return '過重';
  }
  if (27 <= calculate && calculate < 30) {
    return '輕度肥胖';
  }
  if (30 <= calculate && calculate < 35) {
    return '中度肥胖';
  }
  if (35 <= calculate) {
    return '重度肥胖';
  }
}

// 輸出資料
function showData() {
  // >>排序
  var str = '';
  var data = [];
  bmiData.on('value', function (snapshot) {
    // forEach
    snapshot.forEach(function (item) {
      // console.log(item.val());
      data.push(item.val());
      // console.log(data);
    })
    // 反轉
    data.reverse();

    // for回圈
    for (var item in data) {
      // console.log(data[item]);

      // >>固定的程式碼
      var fixedMod1 = '<li class="col-8 row bg-white mt-3 mx-auto align-items-stretch p-0">';
      var fixedMod2 = data[item].Color + '</p>' +
        '<p class="txt-bmi mb-0 font-weight-bold">' + data[item].BMI + '</p>' +
        '<p class="txt-kg mb-0 font-weight-bold">' + data[item].kg + '</p>' +
        '<p class="txt-cm mb-0 font-weight-bold">' + data[item].cm + '</p>' +
        '<p class="txt-date mb-0">' + data[item].time + '</p>' +
        '</li>';
      // >>會改變的程式碼
      switch (data[item].Color) {
        case '理想':
          str += fixedMod1 + '<p class="txt-result txt-result-i mb-0">' + fixedMod2;
          break;
        case '過輕':
          str += fixedMod1 + '<p class="txt-result txt-result-l mb-0">' + fixedMod2;
          break;
        case '過重':
          str += fixedMod1 + '<p class="txt-result txt-result-o mb-0">' + fixedMod2;
          break;
        case '輕度肥胖':
          str += fixedMod1 + '<p class="txt-result txt-result-m mb-0">' + fixedMod2;
          break;
        case '中度肥胖':
          str += fixedMod1 + '<p class="txt-result txt-result-m mb-0">' + fixedMod2;
          break;
        case '重度肥胖':
          str += fixedMod1 + '<p class="txt-result txt-result-h mb-0">' + fixedMod2;
          break;
      }
    }
    // console.log(str);
  });
  // >>寫入網頁
  var writeData = document.querySelector('.writeDataJS');
  writeData.innerHTML = str;
}


// changeBtn();
function changeBtn(color, calculate) {
  var strBMI = '';
  var strText = '';

  var fixedMod1 = '<br><span>BMI</span><span class="loop"></span></p>';

  switch (color) {
    case '理想':
      strBMI = '<p class="result ideal rounded-circle h4 text-center font-weight-bold mb-0">' + calculate + fixedMod1;
      strText = '<span class="text-ideal result-text">' + color + '</span>';
      break;
    case '過輕':
      strBMI = '<p class="result toolight rounded-circle h4 text-center font-weight-bold mb-0">' + calculate + fixedMod1;
      strText = '<span class="text-toolight result-text">' + color + '</span>';
      break;
    case '過重':
      strBMI = '<p class="result over rounded-circle h4 text-center font-weight-bold mb-0">' + calculate + fixedMod1;
      strText = '<span class="text-over result-text">' + color + '</span>';
      break;
    case '輕度肥胖':
      strBMI = '<p class="result medium rounded-circle h4 text-center font-weight-bold mb-0">' + calculate + fixedMod1;
      strText = '<span class="text-medium result-text">' + color + '</span>';
      break;
    case '中度肥胖':
      strBMI = '<p class="result medium rounded-circle h4 text-center font-weight-bold mb-0">' + calculate + fixedMod1;
      strText = '<span class="text-medium result-text">' + color + '</span>';
      break;
    case '重度肥胖':
      strBMI = '<p class="result heavy rounded-circle h4 text-center font-weight-bold mb-0">' + calculate + fixedMod1;
      strText = '<span class="text-heavy result-text">' + color + '</span>';
      break;
  }

  var resultJs = document.querySelector('.resultJs');
  resultJs.innerHTML = strBMI;
  var resultText = document.querySelector('.result-text-js');
  resultText.innerHTML = strText;
}








// 啟動按鈕>>計算+傳送資料結果
var result = document.querySelector('.resultJs');
result.addEventListener('click', resultBMI, false);

function resultBMI() {
  // console.log('OK');

  var height = parseInt(document.querySelector('#height').value);
  var weight = parseInt(document.querySelector('#weight').value);
  // console.log(height+'+'+weight);
  var d = new Date()
  var day = d.getDate()
  var month = d.getMonth() + 1
  var year = d.getFullYear()
  var now = month + '-' + day + '-' + year;

  // >>計算
  var calculate = calculateData(height, weight);

  // >>判斷顏色
  var color = colorResult(calculate);

  // >>修改btn
  changeBtn(color, calculate);

  // >>傳送至firebase
  sendFirebase(color, calculate, height, weight, now);

  // >>輸出資料
  showData();
}


// 監控數據
bmiData.on('value', function (snapshot) {
  var path = document.querySelector('.test');
  path.textContent = JSON.stringify(snapshot.val(), null, 3);
  // null,3是縮排設定
})





// var result = document.querySelector('#btn');
// var list = document.querySelector('.list');
// var data = JSON.parse(localStorage.getItem('bmiData')) || [];

// // updateList(data);


// function resultBMI() {
//   var height = parseInt(document.querySelector('.height').value);
//   var weight = parseInt(document.querySelector('.weight').value);
//   var resultData = weight / (height * height / 10000);
//   resultData = resultData.toFixed(2);
//   // var resultData =20;
//   var addHtml = document.querySelector('#btn');
//   // 理想
//   var resultAnserIdeal =
//     '<div class="result ideal">' +
//     '<p>' + resultData + '<br/><span>BMI</span></p>' +
//     '<span class="loop"></span>' +
//     '</div>' +
//     '<p class="idealcolor text">理想</p>';
//   // 過輕
//   var resultAnserLight =
//     '<div class="result light">' +
//     '<p>' + resultData + '<br/><span>BMI</span></p>' +
//     '<span class="loop"></span>' +
//     '</div>' +
//     '<p class="lightcolor text ">過輕</p>';
//   // 過重
//   var resultAnserOver =
//     '<div class="result over">' +
//     '<p>' + resultData + '<br/><span>BMI</span></p>' +
//     '<span class="loop"></span>' +
//     '</div>' +
//     '<p class="overcolor text">過重</p>';
//   // 輕度肥胖
//   var resultAnserMedium1 =
//     '<div class="result medium">' +
//     '<p>' + resultData + '<br/><span>BMI</span></p>' +
//     '<span class="loop"></span>' +
//     '</div>' +
//     '<p class="mediumcolor text">輕度肥胖</p>';
//   // 中度肥胖
//   var resultAnserMedium2 =
//     '<div class="result medium">' +
//     '<p>' + resultData + '<br/><span>BMI</span></p>' +
//     '<span class="loop"></span>' +
//     '</div>' +
//     '<p class="mediumcolor text">中度肥胖</p>';
//   // 重度肥胖
//   var resultAnserHeavy =
//     '<div class="result heavy">' +
//     '<p>' + resultData + '<br/><span>BMI</span></p>' +
//     '<span class="loop"></span>' +
//     '</div>' +
//     '<p class="heavycolor text">重度肥胖</p>';

//   if (18.5 <= resultData && resultData < 24) {
//     addHtml.innerHTML = resultAnserIdeal;
//   }
//   if (18.5 > resultData) {
//     addHtml.innerHTML = resultAnserLight;
//   }
//   if (24 <= resultData) {
//     addHtml.innerHTML = resultAnserMedium1;
//   }
//   if (27 <= resultData && resultData < 30) {
//     addHtml.innerHTML = resultAnserMedium2;
//   }
//   if (30 <= resultData) {
//     addHtml.innerHTML = resultAnserHeavy;
//   }

// }

// function addData() {
//   var color = document.querySelector('#btn .text').textContent;
//   var height = parseInt(document.querySelector('.height').value);
//   var weight = parseInt(document.querySelector('.weight').value);
//   var resultData = weight / (height * height / 10000);
//   resultData = resultData.toFixed(2);
//   // var now = new Date().toLocaleDateString();
//   var d = new Date()
//   var day = d.getDate()
//   var month = d.getMonth() + 1
//   var year = d.getFullYear()
//   var now = month + '-' + day + '-' + year;
//   // console.log(now);
//   var Ldata = {
//     Color: color,
//     BMI: resultData,
//     kg: weight,
//     cm: height,
//     time: now
//   };
//   // console.log(Ldata);
//   data.push(Ldata);
//   updateList(data);
//   localStorage.setItem('bmiData', JSON.stringify(data));
// }

// function updateList(items) {
//   var str = '';
//   var len = items.length;
//   console.log(len);
//   for (var i = 0; i < len; i++) {
//     switch (items[i].Color) {
//       case '理想':
//         str += '<li>' +
//           '<p class="txt-result-i">' + items[i].Color + '</p>' +
//           '<p class="txt-bmi">' + items[i].BMI + '</p>' +
//           '<p class="txt-kg">' + items[i].kg + 'kg</p>' +
//           '<p class="txt-cm">' + items[i].cm + 'cm</p>' +
//           '<p class="txt-date">' + items[i].time + '</p>' +
//           '</li>';
//         break;
//       case '過輕':
//         str += '<li>' +
//           '<p class="txt-result-l">' + items[i].Color + '</p>' +
//           '<p class="txt-bmi">' + items[i].BMI + '</p>' +
//           '<p class="txt-kg">' + items[i].kg + 'kg</p>' +
//           '<p class="txt-cm">' + items[i].cm + 'cm</p>' +
//           '<p class="txt-date">' + items[i].time + '</p>' +
//           '</li>';
//         break;
//       case '過重':
//         str += '<li>' +
//           '<p class="txt-result-o">' + items[i].Color + '</p>' +
//           '<p class="txt-bmi">' + items[i].BMI + '</p>' +
//           '<p class="txt-kg">' + items[i].kg + 'kg</p>' +
//           '<p class="txt-cm">' + items[i].cm + 'cm</p>' +
//           '<p class="txt-date">' + items[i].time + '</p>' +
//           '</li>';
//         break;
//       case '輕度肥胖':
//         str += '<li>' +
//           '<p class="txt-result-m">' + items[i].Color + '</p>' +
//           '<p class="txt-bmi">' + items[i].BMI + '</p>' +
//           '<p class="txt-kg">' + items[i].kg + 'kg</p>' +
//           '<p class="txt-cm">' + items[i].cm + 'cm</p>' +
//           '<p class="txt-date">' + items[i].time + '</p>' +
//           '</li>';
//         break;
//       case '中度肥胖':
//         str += '<li>' +
//           '<p class="txt-result-m">' + items[i].Color + '</p>' +
//           '<p class="txt-bmi">' + items[i].BMI + '</p>' +
//           '<p class="txt-kg">' + items[i].kg + 'kg</p>' +
//           '<p class="txt-cm">' + items[i].cm + 'cm</p>' +
//           '<p class="txt-date">' + items[i].time + '</p>' +
//           '</li>';
//         break;
//       case '重度肥胖':
//         str += '<li>' +
//           '<p class="txt-result-h">' + items[i].Color + '</p>' +
//           '<p class="txt-bmi">' + items[i].BMI + '</p>' +
//           '<p class="txt-kg">' + items[i].kg + 'kg</p>' +
//           '<p class="txt-cm">' + items[i].cm + 'cm</p>' +
//           '<p class="txt-date">' + items[i].time + '</p>' +
//           '</li>';
//         break;
//     }

//     // str += '<li>'+
//     //             '<p class="txt-result-i">'+items[i].Color+'</p>'+
//     //             '<p class="txt-bmi">'+items[i].BMI+'</p>'+
//     //             '<p class="txt-kg">'+items[i].kg+'kg</p>'+
//     //             '<p class="txt-cm">'+items[i].cm+'cm</p>'+
//     //             '<p class="txt-date">'+items[i].time+'</p>'+
//     //         '</li>';
//   }
//   list.innerHTML = str;

// }









// result.addEventListener('click', resultBMI, false);
// result.addEventListener('click', addData, false);