setInterval(showTime, 1000);
animateCounter();
enableStyleToggle();

function showTime() {
  const clock = document.querySelector('[data-js="clock"]');
  if(!clock) return;

  const date = new Date();
  const hour = date.getHours(); // 0 - 23
  const minute = date.getMinutes(); // 0 - 59
  const second = date.getSeconds(); // 0 - 59

  const time = `${doubleDigits(hour)}:${doubleDigits(minute)}:${doubleDigits(second)}`;
  
  clock.innerText = time;
}
 
function animateCounter () {
  const counter = document.querySelector('[data-js="counter"]');
  if(!counter) return;

  let curValue = parseInt(counter.innerHTML);
  setInterval(() => {
    curValue ++;
    counter.innerText = curValue.toString();
  }, 50);
}

function enableStyleToggle() {
  const checkbox = document.querySelector('[data-js="checkbox"]');
  const codepen = document.querySelector('.codepen');
  const activeClass = 'codepen--opentype';

  if(!checkbox || !codepen) return;

  if(checkbox.checked) {
    codepen.classList.add(activeClass);
  }

  checkbox.addEventListener('change', () => {
    codepen.classList.toggle(activeClass);
  })
}

function doubleDigits(value) {
  return value = (value < 10) ? `0${value}` : value;
}