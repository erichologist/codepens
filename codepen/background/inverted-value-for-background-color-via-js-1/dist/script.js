var box_inverted_css = document.querySelector('.box--inverted-css'), 
    styles = window.getComputedStyle(box_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/\d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(ch) {
        return 255 - ch;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')',
    box_inverted_js = document.querySelector('.box--inverted-js');

box_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);

var box_inverted_css = document.querySelector('.boxc--inverted-css'), 
    styles = window.getComputedStyle(box_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /*[red,green,blue]*/,
    inverted_channels = channels.map(function(ch) {
        return 255 - ch;
    }) /*[255 - red, 255 - green, 255 - blue]*/, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')',
    box_inverted_js = document.querySelector('.boxc--inverted-js');

box_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);

var box_b_inverted_b_css = document.querySelector('.box_b--inverted_b-css'), 
    styles = window.getComputedStyle(box_b_inverted_b_css), 
    original_b = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_b_channels = channels.map(function(ch) {
        return 255 - ch;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted_b = 'rgb(' + inverted_b_channels.join(', ') + ')', 
    box_b_inverted_b_js = document.querySelector('.box_b--inverted_b-js');

box_b_inverted_b_js.style.backgroundColor = inverted;

console.log(original_b, inverted_b);


var boxc_inverted_css = document.querySelector('.boxc--inverted-css'), 
    styles = window.getComputedStyle(boxc_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(ch) {
        return 255 - ch;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxc_inverted_js = document.querySelector('.boxc--inverted-js');

boxc_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxd_inverted_css = document.querySelector('.boxd--inverted-css'), 
    styles = window.getComputedStyle(boxd_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chd) {
        return 255 - chd;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxd_inverted_js = document.querySelector('.boxd--inverted-js');

boxd_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxe_inverted_css = document.querySelector('.boxe--inverted-css'), 
    styles = window.getComputedStyle(boxe_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(che) {
        return 255 - che;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxe_inverted_js = document.querySelector('.boxe--inverted-js');

boxe_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxf_inverted_css = document.querySelector('.boxf--inverted-css'), 
    styles = window.getComputedStyle(boxf_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chf) {
        return 255 - chf;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxf_inverted_js = document.querySelector('.boxf--inverted-js');

boxf_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxg_inverted_css = document.querySelector('.boxg--inverted-css'), 
    styles = window.getComputedStyle(boxg_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chg) {
        return 255 - chg;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxg_inverted_js = document.querySelector('.boxg--inverted-js');

boxg_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxh_inverted_css = document.querySelector('.boxh--inverted-css'), 
    styles = window.getComputedStyle(boxh_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chh) {
        return 255 - chh;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxh_inverted_js = document.querySelector('.boxh--inverted-js');

boxh_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxi_inverted_css = document.querySelector('.boxi--inverted-css'), 
    styles = window.getComputedStyle(boxi_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chi) {
        return 255 - chi;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxi_inverted_js = document.querySelector('.boxi--inverted-js');

boxi_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxj_inverted_css = document.querySelector('.boxj--inverted-css'), 
    styles = window.getComputedStyle(boxj_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chj) {
        return 255 - chj;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxj_inverted_js = document.querySelector('.boxj--inverted-js');

boxj_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxk_inverted_css = document.querySelector('.boxk--inverted-css'), 
    styles = window.getComputedStyle(boxk_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chk) {
        return 255 - chk;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxk_inverted_js = document.querySelector('.boxk--inverted-js');

boxk_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxl_inverted_css = document.querySelector('.boxl--inverted-css'), 
    styles = window.getComputedStyle(boxl_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chl) {
        return 255 - chl;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxl_inverted_js = document.querySelector('.boxl--inverted-js');

boxl_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxm_inverted_css = document.querySelector('.boxm--inverted-css'), 
    styles = window.getComputedStyle(boxm_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chm) {
        return 255 - chm;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxm_inverted_js = document.querySelector('.boxm--inverted-js');

boxm_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxn_inverted_css = document.querySelector('.boxn--inverted-css'), 
    styles = window.getComputedStyle(boxn_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chn) {
        return 255 - chn;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxn_inverted_js = document.querySelector('.boxn--inverted-js');

boxn_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxo_inverted_css = document.querySelector('.boxo--inverted-css'), 
    styles = window.getComputedStyle(boxo_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(cho) {
        return 255 - cho;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxo_inverted_js = document.querySelector('.boxo--inverted-js');

boxo_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxp_inverted_css = document.querySelector('.boxp--inverted-css'), 
    styles = window.getComputedStyle(boxp_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chp) {
        return 255 - chp;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxp_inverted_js = document.querySelector('.boxp--inverted-js');

boxp_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxq_inverted_css = document.querySelector('.boxq--inverted-css'), 
    styles = window.getComputedStyle(boxq_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chq) {
        return 255 - chq;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxq_inverted_js = document.querySelector('.boxq--inverted-js');

boxq_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxr_inverted_css = document.querySelector('.boxr--inverted-css'), 
    styles = window.getComputedStyle(boxr_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chr) {
        return 255 - chr;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxr_inverted_js = document.querySelector('.boxr--inverted-js');

boxr_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxs_inverted_css = document.querySelector('.boxs--inverted-css'), 
    styles = window.getComputedStyle(boxs_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chs) {
        return 255 - chs;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxs_inverted_js = document.querySelector('.boxs--inverted-js');

boxs_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxt_inverted_css = document.querySelector('.boxt--inverted-css'), 
    styles = window.getComputedStyle(boxt_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(cht) {
        return 255 - cht;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxt_inverted_js = document.querySelector('.boxt--inverted-js');

boxt_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);




var boxva_inverted_css = document.querySelector('.boxva--inverted-css'), 
    styles = window.getComputedStyle(boxva_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chva) {
        return 255 - chva;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxva_inverted_js = document.querySelector('.boxva--inverted-js');

boxva_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvb_inverted_vb_css = document.querySelector('.boxvb--inverted-css'), 
    styles = window.getComputedStyle(boxvb_inverted_vb_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvb) {
        return 255 - chvb;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvb_inverted_vb_js = document.querySelector('.boxvb--inverted-js');

boxvb_inverted_vb_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvc_inverted_css = document.querySelector('.boxvc--inverted-css'), 
    styles = window.getComputedStyle(boxvc_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvc) {
        return 255 - chvc;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvc_inverted_js = document.querySelector('.boxvc--inverted-js');

boxvc_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvd_inverted_css = document.querySelector('.boxvd--inverted-css'), 
    styles = window.getComputedStyle(boxvd_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvd) {
        return 255 - chvd;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvd_inverted_js = document.querySelector('.boxvd--inverted-js');

boxvd_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxve_inverted_css = document.querySelector('.boxve--inverted-css'), 
    styles = window.getComputedStyle(boxve_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chve) {
        return 255 - chve;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxve_inverted_js = document.querySelector('.boxve--inverted-js');

boxve_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvf_inverted_css = document.querySelector('.boxvf--inverted-css'), 
    styles = window.getComputedStyle(boxvf_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvf) {
        return 255 - chvf;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvf_inverted_js = document.querySelector('.boxvf--inverted-js');

boxvf_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvg_inverted_css = document.querySelector('.boxvg--inverted-css'), 
    styles = window.getComputedStyle(boxvg_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvg) {
        return 255 - chvg;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvg_inverted_js = document.querySelector('.boxvg--inverted-js');

boxvg_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvh_inverted_css = document.querySelector('.boxvh--inverted-css'), 
    styles = window.getComputedStyle(boxvh_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvh) {
        return 255 - chvh;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvh_inverted_js = document.querySelector('.boxvh--inverted-js');

boxvh_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvi_inverted_css = document.querySelector('.boxvi--inverted-css'), 
    styles = window.getComputedStyle(boxvi_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvi) {
        return 255 - chvi;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvi_inverted_js = document.querySelector('.boxvi--inverted-js');

boxvi_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvj_inverted_css = document.querySelector('.boxvj--inverted-css'), 
    styles = window.getComputedStyle(boxvj_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvj) {
        return 255 - chvj;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvj_inverted_js = document.querySelector('.boxvj--inverted-js');

boxvj_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvk_inverted_css = document.querySelector('.boxvk--inverted-css'), 
    styles = window.getComputedStyle(boxvk_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvk) {
        return 255 - chvk;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvk_inverted_js = document.querySelector('.boxvk--inverted-js');

boxvk_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvl_inverted_css = document.querySelector('.boxvl--inverted-css'), 
    styles = window.getComputedStyle(boxvl_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvl) {
        return 255 - chvl;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvl_inverted_js = document.querySelector('.boxvl--inverted-js');

boxvl_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvm_inverted_css = document.querySelector('.boxvm--inverted-css'), 
    styles = window.getComputedStyle(boxvm_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvm) {
        return 255 - chvm;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvm_inverted_js = document.querySelector('.boxvm--inverted-js');

boxvm_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvn_inverted_css = document.querySelector('.boxvn--inverted-css'), 
    styles = window.getComputedStyle(boxvn_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvn) {
        return 255 - chvn;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvn_inverted_js = document.querySelector('.boxvn--inverted-js');

boxvn_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvo_inverted_css = document.querySelector('.boxvo--inverted-css'), 
    styles = window.getComputedStyle(boxvo_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvo) {
        return 255 - chvo;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvo_inverted_js = document.querySelector('.boxvo--inverted-js');

boxvo_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



var boxvp_inverted_css = document.querySelector('.boxvp--inverted-css'), 
    styles = window.getComputedStyle(boxvp_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(chvp) {
        return 255 - chvp;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    boxvp_inverted_js = document.querySelector('.boxvp--inverted-js');

boxvp_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);



