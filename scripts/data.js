import Vue from 'vue';

var appData = new Vue({
    el : '#app',
    data : {
        xPos : '',
        yPos : '',
        freq : '',
        waveSelect : 'sine',
        unitSelect : 'oscillator'
    }
});

export default appData;