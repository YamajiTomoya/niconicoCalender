import * as Holiday from '/holiday.js';
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth(); // 0-indexなので注意
var modal = moldModal();


contructCalenderMold();
exeCalenderProcess();  // 初回起動
applyHoliday(year, month);

function exeCalenderProcess(){
    contructCalenderMold();
    var calender = makeCalenderBaseData(year, month);
    showCalenderHeader();
    showCalender(calender);
    grantCalenderColor();
    applyHoliday(year, month);
}


$('#next-btn').click(function(){ 
    addMonth();
    exeCalenderProcess();
    $('#modal').hide();
});


$('#prev-btn').click(function(){ 
    subMonth();
    exeCalenderProcess();
    $('#modal').hide();
});


function addMonth(){
    month += 1;
    if (month == 12){
        month = 0;
        year += 1
    }
}


function subMonth(){
    month -= 1;
    if (month == -1){
        month = 11;
        year -= 1
    }
}


// カレンダーに表示するデータを作ります
function makeCalenderBaseData(year, month){
    // year年month月は何日あるか
    var numOfDay = new Date(year, month + 1, 0).getDate();
    
    // year年month月は何曜日から始まるか
    var choicedYearMonth = new Date(year, month, 1, 9, 0);  // 9時間の時差を調整
    var startDayOfWeeK = choicedYearMonth.getDay();

    // カレンダーを一次元配列で表現
    var oneDimensionalCalender = Array(42);
    oneDimensionalCalender.fill('');
    var day = 1
    for (let i = startDayOfWeeK; i < startDayOfWeeK + numOfDay; i++){
        oneDimensionalCalender[i] = day;
        day++;
    }

    // 6行7列の二次元配列としてカレンダーを表現
    var calender = [];
    for(var i = 0; i < 42; i += 7){
        calender.push(oneDimensionalCalender.slice(i, i + 7));
    }


    // 先頭行に曜日を追加
    calender.unshift(['日', '月', '火', '水', '木', '金', '土'])
    return calender;
}


// カレンダー上部の〇〇年××月を表示します
function showCalenderHeader(){
    $('#calender-header #text').text(`${year}年${month + 1}月`);
}


// カレンダーの型にデータを差し込みます
function showCalender(calender){
    for (let i = 0; i < calender.length; i++){
        for (let j = 0; j < calender.length; j++){
            if (i == 0) {
                $('.legend').eq(j).text(calender[i][j]);
            } else {
                //  曜日部があるので、日付け部は７番目から始まる(0-indexed)
                $('.day-number').eq(7 * i + j - 7).text(calender[i][j]);
            }
        }
    }
}


// カレンダーの土曜日・日曜日に対して各色に対応したクラスを付与します
function grantCalenderColor(year, month){
    for (let i = 0; i < 49; i++){
        // 日曜日は0, 7, 14...番目、土曜日は6, 13, 20...番目 
        if (i % 7 == 0){
            $('td').eq(i).addClass('sunday');
        } else if (i % 7 == 6) {
            $('td').eq(i).addClass('saturday');
        } else {
            $('td').eq(i).addClass('weekday');
        }
    }
}


// カレンダーが入る表のhtmlを構築します
function contructCalenderMold(){
    var rows = [];
    var table = document.createElement('table')
    var calenderRowNum = 7; // 曜日部分に１行
    var calenderColNum = 7;
    
    for(let i = 0; i < calenderRowNum; i++){
        rows.push(table.insertRow(-1));
        for(let j = 0; j < calenderColNum; j++){
            var cell = rows[i].insertCell(-1);
            if (i == 0){
                cell.className = 'legend';
                cell.appendChild(moldCalenderLegend());
            } else {
                cell.className = 'date'
                cell.appendChild(moldCalenderContent());
            }
        }
    }
    document.getElementById('calender').removeChild(document.getElementById('calender').childNodes[0]);
    document.getElementById('calender').appendChild(table);
}

// 曜日部分のelement tree
function moldCalenderLegend(){
    var divWrapper = document.createElement('div');
    var pLegend = document.createElement('p');
    divWrapper.className = 'legend-wrapper';
    pLegend.className = 'legend';
    divWrapper.appendChild(pLegend);
    return divWrapper
}

// 日付け部分のelement tree
function moldCalenderContent(){
    var divWrapper = document.createElement('div');
    var divUpper = document.createElement('div');
    var divLower = document.createElement('div')
    var img = document.createElement('img');
    var pDayNumber = document.createElement('p');
    var pDayText = document.createElement('p');

    divWrapper.className = 'content-wrapper';
    divUpper.className = 'upper-part';
    divLower.className = 'lower-part';
    img.src = "";
    img.alt = "";
    pDayNumber.className = 'day-number';
    pDayText.className = 'day-text';

    divUpper.appendChild(pDayNumber);
    divUpper.appendChild(pDayText);
    divLower.appendChild(img);
    divWrapper.appendChild(divUpper);
    divWrapper.appendChild(divLower);

    return divWrapper;
}

// モーダルの型
function moldModal(){
    var modal = document.createElement('div');
    var imgSmile = document.createElement('img');
    var imgNormal = document.createElement('img');
    var imgSad = document.createElement('img');

    modal.id = 'modal';
    imgSmile.src = 'img/smile.png'
    imgNormal.src = 'img/normal.png'
    imgSad.src = 'img/sad.png'

    modal.appendChild(imgSmile);
    modal.appendChild(imgNormal);
    modal.appendChild(imgSad);

    return modal;
}

// モーダルの表示
$(document).on('click', '.date', function(){
        // 先に準備しておかないと、１回目の表示スピードがずれます
        var cell = this;
        cell.appendChild(modal);

        // 一度隠す
        $('#modal').hide();
        
        // 日付けが無い部分をクリックしても何も表示しない
        if ($(this).find('.day-number')[0].innerText == ''){
            return
        }

        // クリックされた日付けセルの下にモーダルを表示
        $('#modal').fadeIn(100);
        var position = cell.getBoundingClientRect();;
        var modalY = position.top + 50;
        var modalX = position.left - 20;
        modal.style.top = modalY + 'px';
        modal.style.left = modalX + 'px';
    }, 
);

// ニコニコマークの表示
$(document).on('click', 'img', function(event){
　  var src = $(this).attr('src')
    $('td:has(#modal)').find('img').eq(0).attr('src', src);
    $('#modal').hide();
    event.stopPropagation(); // 再表示をブロック
});

// 祝日のデータを取得して、カレンダーの
function applyHoliday(year, month){
    var holidayData = Holiday.getHoliday(year);
    // year年month月は何曜日から始まるか
    var choicedYearMonth = new Date(year, month, 1, 9, 0);  // 9時間の時差を調整
    var startDayOfWeeK = choicedYearMonth.getDay();
    
    console.log(startDayOfWeeK);
    for (let holiday of holidayData){
        if (holiday['month'] - 1 == month){
            $('td').eq(parseInt(holiday['date']) + startDayOfWeeK  +7 - 1).addClass('holiday');
            $('.day-text').eq(parseInt(holiday['date']) + startDayOfWeeK - 1).text(holiday['name']);
        }
    }

}

