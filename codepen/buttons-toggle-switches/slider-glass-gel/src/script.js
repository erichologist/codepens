import RangeSlider from "https://esm.sh/svelte-range-slider-pips";


const q$ = document.querySelector.bind(document);
const q$a = document.querySelectorAll.bind(document);

const startValue = 67;
const min = 0;
const max = 100;
const $slider = q$('#slider');

// initialise the slider
const slider = new RangeSlider({
    target: $slider,
    props: {
        value: startValue,
        range: 'min',
        min,
        max,
        pips: true,
        rest: false,
        first: 'label',
        last: 'label',
        springValues: { stiffness: 0.125, damping: 0.6 },
        float: true
    }
});








/* handle style changes */
const $radios = q$a('.group.style input');
$radios.forEach($el => {
    $el.addEventListener('change', (ev) => {
        updateStyle();
    });
});
const updateStyle = () => {
    const $checked =  q$('.group.style :checked');
    const style = $checked.id;
    $slider.setAttribute('data-style', style);
}
const randomColor = Math.floor(Math.random() * $radios.length); 
$radios[randomColor].checked = true;
updateStyle();

















/* handle theme toggle */

const $themeToggle = document.querySelector('#theme-toggle');
$themeToggle.checked = false; 
const setTheme = () => {
    document.body.classList.add('themed');
    document.body.toggleAttribute('is-dark', $themeToggle.checked);
}
$themeToggle.addEventListener('change', setTheme);
setTheme();