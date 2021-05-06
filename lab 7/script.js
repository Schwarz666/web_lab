//____________________AUDIO_______________________
var audioCtx;
var source;
var gainNode, panNode;

var commonBuffer = {};
var curTrackName;

var playStartTime = 0;
var deltaTime = 0;
var is_playing = false;

function init() {
    try {
        audioCtx = new AudioContext();
        gainNode = audioCtx.createGain();                 //контроль громкости
        biquadFilter = audioCtx.createBiquadFilter();     //фильтр верхних частот, как фильтр нижних частот, фильтр полосы пропускания и так далее.
        panNode = audioCtx.createStereoPanner();            //узел для перемещения аудиопотока вправо или влево.
    } catch(e) { 
        alert('WebAudio does not supported');
    }
}

function loadFile(name, file) {
    audioCtx.decodeAudioData(file, function (buffer) {     //Асинхронно декодирует данные из аудио-файла
        addToBuffer(name, buffer);
    });
}

function play() {
    is_playing = true;
    //btn_play_pause.innerHTML = "||";
    btn_play_pause.childNodes[0].src = 'img/pause.png';

    playStartTime+=deltaTime;
    if ((playStartTime <= 0)||(playStartTime >= source.buffer.duration)) playStartTime = 0;

    source = audioCtx.createBufferSource();
    source.buffer = commonBuffer[curTrackName];
    source.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(audioCtx.destination);

    applyBiquadFilter();

    source.start(0, playStartTime);
    deltaTime = audioCtx.currentTime;

    startTimelineChanger ();
}

function pause() {
    is_playing = false;
    btn_play_pause.childNodes[0].src = 'img/play.png';

    source.stop(0);
    deltaTime = audioCtx.currentTime - deltaTime;
    stopTimelineChanger ();
}

function playpause() {
    if (!is_playing) play();
    else pause();
}

function stop() {
    if (source!== undefined) {
        source.stop(0);
        playStartTime = 0;
        deltaTime = 0;
        stopTimelineChanger ();
    }
}

function next() {
    var i = 0;
    var length = Object.keys(commonBuffer).length;
    for (; i<length; i++) if (Object.keys(commonBuffer)[i] === curTrackName) break;

    curTrackName = Object.keys(commonBuffer)[(i + 1)%length];
    h_cur_track_name.innerHTML =  curTrackName;

    stop();
    resetTimeline();
    play();
}

function previous() {   //предыдущий
    var i = 0;
    var length = Object.keys(commonBuffer).length;
    for (; i<length; i++) if (Object.keys(commonBuffer)[i] === curTrackName) break;

    curTrackName = Object.keys(commonBuffer)[(i - 1 + length)%length];
    h_cur_track_name.innerHTML =  curTrackName;

    stop();
    resetTimeline();
    play();
}

function skip(delta) {    //пропустить
    pause();
    deltaTime+=delta;
    changeTimeline(delta);
    play();
}

function skipForward() {    //пропустить вперед
    skip(10);
}

function skipBack() {  //пропустить назад
    skip(-10);
}

function gotoTime(time) {   //перейти по времени
    stop();
    playStartTime = time;
    deltaTime=0;
    play();
}

function gotoEach(period) {   
    var cur_time = Math.round(getCurrentTime());
    cur_time += period;
    if (cur_time < 0) {
        cur_time = 0;
    }
    else if (cur_time % period !== 0) {
        if (period > 0) cur_time -= cur_time % period;
        else cur_time += (period + cur_time % period)*(-1);
    }
    gotoTime(cur_time);
    gotoTimeline(cur_time);
}

function gotoNext30 (){
    gotoEach (30);
}

function gotoPrew30 (){
    gotoEach (-30);
}

function changeVolume (value) {
    gainNode.gain.value=value;
}

init();

//__________________effects______________
var biquadFilter;
var is_biquad = false;

var cur_biquad_frequency = 0;
var cur_biquad_gain = 0;

function changeBiquadFilter() {
    biquadFilter.type = "lowshelf";
    biquadFilter.frequency.value = cur_biquad_frequency;
    biquadFilter.gain.value = cur_biquad_gain;
}

function applyBiquadFilter() {
    if (is_biquad) {
        source.disconnect(gainNode);
        source.connect(biquadFilter);
        biquadFilter.connect(gainNode);
        changeBiquadFilter();
    }
    else{
        biquadFilter.disconnect();
        source.connect(gainNode);
    }
}

function switchBiquadFilter() {
    is_biquad = !is_biquad;
    if (is_biquad) /*btn_biquad.innerHTML = "Биквадрат ВКЛ";*/ btn_biquad.childNodes[0].src = 'img/biquad_off.png';
    else btn_biquad.childNodes[0].src = 'img/biquad_on.png';
    applyBiquadFilter();
}

function changePan(cur_pan) {
    panNode.pan.value = cur_pan;
}

//___________________buffer_______________
function addToBuffer (name, track_data) {
    commonBuffer[name] = track_data;
    alert ("Трек " + name + " загружен");

}
function removeFromBuffer (name) {
    delete commonBuffer[name];
}

//______________________________INTERFACE___________________
var btn_play_pause = document.querySelector('#_btn_play_pause');
var btn_next = document.querySelector('#_btn_next');
var btn_prew = document.querySelector('#_btn_prew');
var btn_skip_forward = document.querySelector('#_btn_skip_forward');
var btn_skip_back = document.querySelector('#_btn_skip_back');
var btn_next_30 = document.querySelector('#_btn_goto_next_30');
var btn_prew_30 = document.querySelector('#_btn_goto_prew_30');
var h_cur_track_name = document.querySelector('#_cur_track');
var btn_biquad = document.querySelector('#_btn_biquad');

btn_play_pause.onclick = playpause;
btn_next.onclick = next;
btn_prew.onclick = previous;
btn_skip_forward.onclick = skipForward;
btn_skip_back.onclick = skipBack;
btn_next_30.onclick = gotoNext30;
btn_prew_30.onclick = gotoPrew30;
btn_biquad.onclick = switchBiquadFilter;

//__________________input_file_________________________
var input_file = document.querySelector('#_input_file');
input_file.addEventListener('change',inputFileRead, false);

function inputFileRead(e) {
    if (this.files[0] === undefined) return;
    var file_name = this.files[0].name;
    addRow(file_name);

    var reader = new FileReader();
    reader.onload = function(e) {
        loadFile(file_name, this.result);
        };
    reader.readAsArrayBuffer(this. files[0]);
}

//____________________table_____________________________
var tbody = document.getElementsByTagName("tbody")[0];

function addRow(track_name){

    var row = document.createElement("TR");
    var btn = document.createElement("button");
    btn.className = "btn btn-outline-primary";
    btn.value = track_name;
    btn.onclick = removeTrack;
    var img = document.createElement("img");
    img.className = "icon_delete";
    img.src = 'img/delete.png';
    btn.appendChild(img);

    var td1 = document.createElement("TD");
    td1.appendChild(document.createTextNode(track_name));
    td1.onclick = selectTrack;
    td1.style.padding = "15px";
    td1.style.paddingLeft = "30px";
    var td2 = document.createElement("TD");
    td2.appendChild (btn);
    row.appendChild(td1);
    row.appendChild(td2);
    tbody.appendChild(row);
}

function removeTrack (e) {
    removeFromBuffer(this.value);
    var row = this.parentNode.parentNode;
    tbody.removeChild(row);
}

function selectTrack (e) {
    curTrackName = e.target.textContent;
    h_cur_track_name.innerHTML =  curTrackName;

    stop();
    resetTimeline();
    play();
}

//______________________sliders____________________
var volume = document.querySelector('#_volume');
var volume_value_output = document.querySelector('#_volume_value');

volume.oninput = function() {
    var value = this.value /(this.max - this.min);
    volume_value_output.innerHTML = value;
    changeVolume(value);
};

function changeVolumeSlider (delta) {
    volume.value = Math.round(volume.value) + delta;
    var value = volume.value / (volume.max - volume.min);
    volume_value_output.innerHTML = value;
    changeVolume(value);
}

var timeline = document.querySelector('#_timeline');
var time_value_output = document.querySelector('#_time_value');
var idTimelineChanger;

timeline.oninput = function() {
    var cur_second = getSecondsByValue(Math.round(timeline.value));
    gotoTime(cur_second);
    time_value_output.innerHTML = Math.floor(cur_second / 60) + " : " + Math.floor(cur_second % 60);
};

function getSecondsByValue (value){
    return value * source.buffer.duration / (timeline.max - timeline.min);
}

function getValueBySeconds (seconds){
    return seconds * (timeline.max - timeline.min) / source.buffer.duration;
}

function changeTimeline (second_delta){
    if (second_delta === undefined) second_delta = 1;
    var next_second = getSecondsByValue(Math.round(timeline.value)) + second_delta;
    gotoTimeline(next_second);
}

function gotoTimeline (time){
    if ((time < 0) || (time > source.buffer.duration)) time = 0;
    time_value_output.innerHTML = Math.floor(time / 60) + " : " + Math.floor(time % 60);
    timeline.value = getValueBySeconds(time);
}

function getCurrentTime (){
    return getSecondsByValue(Math.round(timeline.value));
}

function startTimelineChanger () {
    idTimelineChanger = setInterval(changeTimeline, 1000);
}

function stopTimelineChanger () {
    clearInterval(idTimelineChanger);
}

function resetTimeline(){
    timeline.value = 0;
    time_value_output.innerHTML = "0:0";
}

var biquad_frequency = document.querySelector('#_biquad_frequency');
var biquad_frequency_output = document.querySelector('#_biquad_frequency_value');
var biquad_gain = document.querySelector('#_biquad_gain');
var biquad_gain_output = document.querySelector('#_biquad_gain_value');

biquad_frequency.oninput = function () {
    cur_biquad_frequency = this.value;
    biquad_frequency_output.innerHTML = this.value;
    changeBiquadFilter();
};

biquad_gain.oninput = function () {
    cur_biquad_gain = this.value;
    biquad_gain_output.innerHTML = this.value;
    changeBiquadFilter();
};

var pan = document.querySelector('#_pan');
var pan_output = document.querySelector('#_pan_value');
pan.oninput = function(){
    var cur_pan = Math.round(this.value)/ Math.round(this.max);
    pan_output.innerHTML = cur_pan;
    changePan(cur_pan);
};

//__________________HOTKEYS___________________
const KEY_CODE_LEFT = 37;
const KEY_CODE_UP = 38;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_DOWN = 40;
const KEY_CODE_SPACE = 32;

document.addEventListener('keydown', hotkeysHandler);

function hotkeysHandler(e) {
    switch (e.keyCode) {
        case KEY_CODE_RIGHT: {
            next();
            break;
        }
        case KEY_CODE_LEFT: {
            previous();
            break;
        }
        case KEY_CODE_SPACE: {
            playpause();
            break;
        }
        case KEY_CODE_UP: {
            changeVolumeSlider (10);
            break;
        }
        case KEY_CODE_DOWN: {
            changeVolumeSlider (-10);
            break;
        }
    }
}