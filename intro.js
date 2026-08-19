const introScreen=document.getElementById('introScreen');
const introVideo=document.getElementById('introVideo');
const skipBtn=document.getElementById('skipBtn');
let redirecting=false;
function goToHome(){if(redirecting)return;redirecting=true;introVideo.pause();introScreen.classList.add('fadeOut');setTimeout(()=>{window.location.href='home.html';},800);}
skipBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();goToHome();});
introVideo.addEventListener('ended',goToHome);
window.addEventListener('load',()=>{introVideo.muted=true;introVideo.volume=1;introVideo.play().catch(err=>console.log('Autoplay blocked:',err));});
document.addEventListener('click',e=>{if(e.target===skipBtn||skipBtn.contains(e.target))return;if(redirecting)return;introVideo.muted=false;introVideo.volume=1;},{once:true});
