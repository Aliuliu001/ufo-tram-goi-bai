let context; let chaseTimer; let enabled = true;
function audio(){context ||= new AudioContext(); return context;}
function tone(freq, at, duration, type='sine', volume=.05){if(!enabled)return;const c=audio(),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,at);g.gain.setValueAtTime(volume,at);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g).connect(c.destination);o.start(at);o.stop(at+duration+.02);}
export function setSoundEnabled(value){enabled=value; if(!enabled)stopChase();}
export function startChase(seconds){stopChase();if(!enabled)return;const c=audio(),start=c.currentTime;let step=0;chaseTimer=setInterval(()=>{const progress=step/Math.max(1,seconds*2);tone(170+progress*180,c.currentTime,.08,'square',.035);if(step%2===0)tone(85,c.currentTime,.05,'triangle',.04);step++;},500);tone(280,start,.12,'sawtooth',.05);}
export function ping(progress=0){if(!enabled)return;const c=audio();tone(520+progress*520,c.currentTime,.09,'sine',.07);}
export function stopChase(){if(chaseTimer){clearInterval(chaseTimer);chaseTimer=null;}}
export function reveal(){stopChase();if(!enabled)return;const c=audio();[392,494,587,784].forEach((f,i)=>tone(f,c.currentTime+i*.07,.3,'triangle',.07));}
