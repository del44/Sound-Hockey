import Vue from 'vue';
import {paramBall} from './ball.js';
import Tone from 'tone';
import {Store,physicsParams,physicsMapping,ballColors,envelopeSet,modulationEnvelopeSet,filterSet} from './Store.js'

Vue.component('audio-block',{
    data : function(){
        return {
            typeSelect : 'Synth',
            unitSelect : 'FMSynth',
            friction : 0.1,
            enableRotate : false,
            physicParams : physicsParams,
            ball : null,
            player : null,
            mapping : new Map(),
            enableAuto : false,
            enableFix : false,
            autoTimer : 300,
            color : 'green',
            ballColors : ballColors,
            position_x : 200,
            position_y : 200,
            realTime : {}
        }
    },

    destroyed : function(){
        if(this.typeSelect === 'Effect'){
            this.effect.dispose();
            window.player.toMaster();
        }
        else if(this.typeSelect === 'Synth'){
            window.player = undefined;
        }
        this.ball.destroy();
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
        },
    },
    watch : {
        // flag : function(val){
        //     for(let musicParam of this.mapping.keys()){      
        //            this.realTime[musicParam] = window.player[musicParam].value;
        //     }
        // }
    },
    methods : {
        confirmMapping : function(){
            for(let i=0;i<this.audioParams.length;i++){
                if(this.selectedPhysics[i] !== 'none'){
                    this.mapping.set(this.audioParams[i], this.selectedPhysics[i]);
                }    
            }
        },

        updateSettings : function(){
            this.mapping = new Map();
            this.confirmMapping();
            if(this.enableRotate){
                this.ball.body.fixedRotation = false;
            }
            else { 
                this.ball.body.fixedRotation = true;
            }
            this.ball.body.damping = this.friction;
        },

        addBall : function(){
            this.confirmMapping();
            if(!this.ball){
                this.ball = new paramBall(this.position_x,this.position_y,this.color);
                if(this.enableRotate){
                    this.ball.body.fixedRotation = false;
                }
                this.ball.body.damping = this.friction;
                if(this.typeSelect === 'Synth'){
                    window.unitSelect = this.unitSelect;
                    window.player = Store[this.typeSelect][this.unitSelect] ? Store[this.typeSelect][this.unitSelect].audio : null;
                    this.updateFunction = () => {
                        for(let [musicParam,physicsParam] of this.mapping.entries()){ 
                            if(envelopeSet.has(musicParam)){
                                window.player.envelope[musicParam] =  physicsMapping.call(this.ball,{music: musicParam, physics:physicsParam},this.unitSelect);
                                Vue.set(this.realTime, musicParam, window.player.envelope[musicParam].toFixed(2));
                            } 
                            else if(modulationEnvelopeSet[musicParam]){
                                window.player.modulationEnvelope[musicParam] =  physicsMapping.call(this.ball,{music: musicParam, physics:physicsParam},this.unitSelect);
                                Vue.set(this.realTime, musicParam, window.player.modulationEnvelope[musicParam].toFixed(2));
                            }
                            else{
                                window.player[musicParam].value =  physicsMapping.call(this.ball,{music: musicParam, physics:physicsParam},this.unitSelect);
                                Vue.set(this.realTime, musicParam, window.player[musicParam].value.toFixed(2));
                            }
                        }
                    }
                    this.ball.update = this.updateFunction;
                }
                else if(this.typeSelect === 'Effect'){
                    this.effect = Store[this.typeSelect][this.unitSelect] ? Store[this.typeSelect][this.unitSelect].audio : null;
                    window.effects[this.unitSelect] = this.effect;
                    window.effect = this.effect;
                    this.updateFunction = () => {
                        for(let [musicParam,physicsParam] of this.mapping.entries()){   
                            if(filterSet[musicParam]){
                                this.effect.filter[musicParam] = physicsMapping.call(this.ball,{music: musicParam, physics:physicsParam},this.unitSelect);
                                Vue.set(this.realTime, musicParam, this.effect.filter[musicParam]);
                            }
                            else{
                                if(typeof this.effect[musicParam] === 'number'){
                                    this.effect[musicParam] =  physicsMapping.call(this.ball,{music: musicParam, physics:physicsParam},this.unitSelect);
                                    Vue.set(this.realTime,musicParam,this.effect[musicParam].toFixed(2)); 
                                }
                                else if(typeof this.effect[musicParam] === 'string'){
                                    this.effect[musicParam] =  physicsMapping.call(this.ball,{music: musicParam, physics:physicsParam},this.unitSelect);
                                    Vue.set(this.realTime,musicParam,this.effect[musicParam]); 
                                }
                                else {
                                    this.effect[musicParam].value =  physicsMapping.call(this.ball,{music: musicParam, physics:physicsParam},this.unitSelect);
                                    Vue.set(this.realTime,musicParam,this.effect[musicParam].value.toFixed(2)); 
                                }
                               
                            }  
                        }
                    }
                    this.ball.update = this.updateFunction;
                    if(window.player){
                        window.player.connect(this.effect);
                    }
                }  
            }
        },

        fixBall : function(){
            this.enableFix = true;
            this.ball.update = () => {
                this.updateFunction();
                this.ball.body.setZeroVelocity();
            }   
        },

        stopFix : function(){
            this.enableFix = false;
            if(this.enableAuto){
                this.startAuto();
            }
            else {
                this.ball.update = this.updateFunction;
            }
        },

        startAuto: function(){
            this.enableAuto = true;
            let autoSpeed = () => {
                this.ball.body.velocity.x = Math.random() * 800 - 400;
                this.ball.body.velocity.y = Math.random() * 800 - 400;
                if(this.enableRotate){
                    this.ball.body.angularVelocity = Math.random() * 8;
                }
            };
            autoSpeed();
            
            this.ball.update  = () => {
                this.updateFunction();
                if(this.enableAuto){
                    if(this.ball.body.velocity.x < 50 || this.ball.body.velocity.y < 50 ){
                        if(!this.autoTimer){
                           autoSpeed(); 
                           this.autoTimer = 300;
                        }
                        else {
                            this.autoTimer--;
                        }
                        
                    }  
                }
            }
        },

        stopAuto: function(){
            this.enableAuto = false;
            this.ball.update = this.updateFunction;
        },

        triggerSound : function(){
            if(window.player){
                window.player.triggerAttackRelease("C4",0.5);
            }
        },

        destroySelf : function(){
            let thisNode = this.$el;
            thisNode.parentNode.removeChild(thisNode);
            if(this.typeSelect === 'Effect'){
                this.effect.dispose();
                window.player.toMaster();
            }
            else if(this.typeSelect === 'Synth'){
                window.player = undefined;
            }
            this.ball.destroy();
            //Use this shitty method for now
        }  
    },
    template : `<div style="display:inline-block">
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
                        <input type="text" v-model='friction' />
                        <br />
                        <span>initial position x</span>
                        <input type="text" v-model='position_x' />
                        <br />
                        <span>initial position y</span>
                        <input type="text" v-model='position_y' />
                        <br />
                        <span>enableRotate</span>
                        <input type="checkbox" v-model='enableRotate' />
                    </div>
                    <section>
                        <table>
                            <thead>
                                <tr>
                                    <td>Music Params</td>
                                    <td>Physics Params</td>
                                    <td>Value</td>
                            </thead>
                            <tbody>
                                <tr v-for="(param,index) in audioParams">
                                    <td>{{param}}</td>
                                    <td>
                                        <select v-model="selectedPhysics[index]">
                                            <option  v-for="params in physicParams">{{params}}</option>
                                        </select>
                                    </td>
                                    <td>{{realTime[param]}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <select v-model="color">
                        <option v-for="color in ballColors">
                            {{color}}
                        </option>
                    </select>
                    <br />
                    <button v-on:click="addBall">add Ball</button>
                    <button @click="$emit('delete-unit')">Delete</button>
                    <button v-on:click='fixBall' v-if="!enableFix">Fix</button>
                    <button v-on:click='stopFix' v-if="enableFix">Stop Fix</button>
                    <button v-on:click='startAuto' v-if="!enableAuto">Auto</button>
                    <button v-on:click='stopAuto' v-if="enableAuto">Stop Auto</button>
                    <button v-on:click='updateSettings'>Update</button>
                    <button v-on:click='triggerSound'>Trigger</button>
                </div>
                    `
               
});


var appData = new Vue({
    el : '#app',
    data : {
        audioBlockCount:[]
    },

    template : `
                <div>
                <button v-on:click="addAudioUnit">Add!</button>
                <span>
                    <audio-block v-for="(block,index) in audioBlockCount" 
                    v-on:delete-unit="deleteAudioUnit(index)">
                    </audio-block>
                </span>

                </div>
                `,

    methods : {
        // addAudioUnit : function(){
        //     var component = new audioBlock().$mount();
        //     document.getElementById('app').appendChild(component.$el);
        // },
        addAudioUnit : function(){
            let length = this.audioBlockCount.length;
            Vue.set(this.audioBlockCount, length, '1');
        },

        deleteAudioUnit : function(index){
            this.audioBlockCount.splice(index,1);
        }
    }
})


export default appData;