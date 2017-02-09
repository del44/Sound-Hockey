import Vue from 'vue';
import {paramBall} from './ball.js';
import Tone from 'tone';
import {Store,Physics} from './Store.js'

Vue.component('audioBlock', {
    data : function(){
        return {
            typeSelect : 'Synth',
            unitSelect : 'FMSynth',
            friction : 0,
            enableRotate : false,
            physicParams : Physics,
            ball : null,
            player : null,
            mapping : {}
        }
    },

    computed : {
        audioModules : function(){
            return Store[this.typeSelect];
        },
        audioUnit : function(){
            return Object.keys(this.audioModules);
        },
        audioParams : function(){
            return Store[this.typeSelect][this.unitSelect] ? Store[this.typeSelect][this.unitSelect].params : null;
        },
        selectedPhysics : function(){
            let arr = Array(this.audioParams.length);
            return arr.fill('none');
        }
    },
    watch : {

    },
    methods : {
        triggerSound : function(){
            Synth.triggerAttackRelease("D4", "4n");
        },
        confirmMapping : function(){
            for(let i=0;i<this.audioParams.length;i++){
                this.mapping[this.audioParams[i]] = this.selectedPhysics[i];
            }
        },
        addBall : function(){
            this.player = Store[this.typeSelect][this.unitselect] ? Store[this.typeSelect][this.unitselect].audio : null;
        }
    },
    template : `<div>
                    <select v-model="typeSelect">
                        <option>Synth</option>
                        <option>Effect</option>
                    </select>
                    <div>
                        <select v-model="unitSelect" >
                            <option v-for="unit in audioUnit">{{unit}}</option> 
                        </select>
                    </div>
                    <div>
                        <span>friction</span>
                        <input type="text" v-bind:value='friction' />
                        <br />
                        <span>enableRotate</span>
                        <input type="checkbox" b-bind:value='enableRotate' />
                    </div>
                    <section>
                        <table>
                            <thead>
                                <tr>
                                    <td>Music Params</td>
                                    <td>Physics Params</td>
                            </thead>
                            <tbody>
                                <tr v-for="(param,index) in audioParams">
                                    <td>{{param}}</td>
                                    <td>
                                        <select v-model="selectedPhysics[index]">
                                            <option  v-for="params in physicParams">{{params}}</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <button v-on:click="confirmMapping">confirm</button>
                    <button v-on:click="addBall">add Ball</button>
                    <button v-on:click='triggerSound'>Trigger</button>
                    `
               
})


var appData = new Vue({
    el : '#app'
})
// var appData = new Vue({
//     el : '#app',
//     data : {
//         synthSelect : 'MemberaneSynth',
//         checkedParams : [],
//     },
//     computed : {
//         synthParams : function(){
//             return SynthParams[this.synthSelect];
//         }
//     },
//     watch : {
//         synthSelect : function(val){
//             this.checkedParams = [];
//         }
//     },
//     methods : {
//         addNewBall : function(){
//             let L = this.checkedParams.length;
//             for(let i=0;i<L;i++){
//                 if(this.checkedParams[i] === 'pitchDecay'){
//                     let ball = new paramBall();
//                     currentBalls['pitchDecay'] = ball;
//                 //    currentBalls['pitchDecay_ball'] = true;
//                     //how the sound parameter changes according to the position. mapping coefficient
//                     //is fixed now.
//                     ball.update = function(){
//                         Synth.pitchDecay = this.position.x * 0.0078125;
//                     }
//                 }
//                 if(this.checkedParams[i] === 'octaves'){
//                     let ball = new paramBall();
//                     currentBalls['octaves'] = ball;
//                     ball.update = function(){
//                         Synth.octaves = this.position.x * 0.03125;
//                     }
//                 }
//             }
//             console.log(this.synthParams);
//         },

//         triggerSound : function(){
//             Synth.triggerAttackRelease("D4", "4n");
//         }
//     }
// });

export default appData;