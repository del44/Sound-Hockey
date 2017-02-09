import Tone from 'tone'
const Store = {
	Synth : {
		MembraneSynth : {
			params:['pitchDecay','octaves'],
			audio : new Tone.MembraneSynth()
		},
		
		FMSynth : {
			params:['harmonicity','detune'],
			audio : new Tone.FMSynth()
		}
	},
	Effect : {
		Freeverb : {
			audio : new Tone.FMSynth(),
			params : ['roomSize','dampening','wet'],
		},
		
		Chebyshev : {
			params : ['order','oversample','wet'],
			audio : new Tone.FMSynth()
		}
	},

	
}

const Physics = ['none','position-x','position-y','velocity-x','velocity-y'];

export {Store,Physics};