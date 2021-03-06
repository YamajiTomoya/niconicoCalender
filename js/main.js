import * as CalenderMold from './calender_mold.js';
import * as Calender from './calender.js'

var now = new Date();
var year = now.getFullYear();
var month = now.getMonth(); // 0-indexなので注意

exeCalenderProcess();  // 初回起動


// カレンダーを再構築します
function exeCalenderProcess(){
    $('#modal').hide();
    CalenderMold.contructCalenderMold();
    Calender.showCalenderHeader(year, month)
    Calender.showCalender(year, month);
}


// 方向キーでのカレンダーめくり
document.onkeydown = keydown;
function keydown() {
    // 右（進む）
    if (event.keyCode == 39){
        $('#next-btn img').css('height', '100%');
        $('#next-btn img').css('width', '100%');
        addMonth();
        exeCalenderProcess();
    }
    // 左（戻る）
    if (event.keyCode == 37){
        $('#prev-btn img').css('height', '100%');
        $('#prev-btn img').css('width', '100%');
        subMonth();
        exeCalenderProcess();
    }
}

document.onkeyup = keyup;
function keyup() {
    // 右（進む）
    if (event.keyCode == 39){
        $('#next-btn img').css('height', '');  // 再び外部CSSを参照する
        $('#next-btn img').css('width', '');
    }
    // 左（戻る）
    if (event.keyCode == 37){
        $('#prev-btn img').css('height', '');
        $('#prev-btn img').css('width', '');
    }
}


// 翌月のカレンダーに進むボタン
$('#next-btn').click(function(){ 
    addMonth();
    exeCalenderProcess();
    
});


// 前月のカレンダーに戻るボタン
$('#prev-btn').click(function(){ 
    subMonth();
    exeCalenderProcess();
});


// 翌月に進む
function addMonth(){
    month += 1;
    if (month == 12){
        month = 0;
        year += 1
    }
}


// 前月に戻る
function subMonth(){
    month -= 1;
    if (month == -1){
        month = 11;
        year -= 1
    }
}
