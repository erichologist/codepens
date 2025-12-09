/* eslint no-console: 0, no-unused-vars: 0, no-empty:  0 */

(() => {
  "use strict";

  const nums = '123467890',
  letters = 'abcdefghijklmnopqestuvwxyz',
  puncts_symbols = '.,;:-–—_§#@€?%£$%&*{[()]}=?^/|\\\'"‘’“”«»',
  diacritics = 'àèéìòùç',
  ligatures = 'ff, fi, fl, ffi, ffl, fj, fk',
  fractions = '1/2 1/3 1/4 1/5 1/5 2/3 2/4 3/4',

  font_features = [
    {
      title: 'Lining Nums',
      sample:  nums,
      style: [
        'font-variant-numeric: lining-nums;',
        'font-feature-settings: "lnum";'
      ]
    },
    {
      title: 'Old Style Nums',
      sample:  nums,
      style: [
        'font-variant-numeric: oldstyle-nums;',
        'font-feature-settings: "onum";'
      ]
    },
    {
      title: 'Proportionals Nums',
      sample:  nums,
      style: [
        'font-variant-numeric: proportional-nums;',
        'font-feature-settings: "pnum";'
      ]
    },
    {
      title: 'Tabular Nums',
      sample:  nums,
      style: [
        'font-variant-numeric: tabular-nums;',
        'font-feature-settings: "tnum";'
      ]
    },
    {
      title: 'Lining + Tabular Nums',
      sample:  nums,
      style: [
        'font-variant-numeric: lining-nums tabular-nums;',
        'font-feature-settings: "lnum", "tnum";'
      ]
    },
    {
      title: 'Diagonal fractions',
      sample:  fractions,
      style: [
        'font-variant-numeric: diagonal-fractions;',
        'font-feature-settings: "frac";'
      ]
    },
    {
      title: 'Stacked fractions',
      sample:  fractions,
      style: [
        'font-variant-numeric: stacked-fractions;',
        'font-feature-settings: "afrc";'
      ]
    },
    {
      title: 'Slashed zero',
      sample:  '0',
      style: [
        'font-variant-numeric: slashed-zero;',
        'font-feature-settings: "zero";'
      ]
    },
    {
      title: 'Ordinal nums',
      sample:  '1st, 2nd, 3rd, 4th',
      style: [
        'font-variant-numeric: slashed-zero;',
        'font-feature-settings: \'ordn\''
      ]
    },
    {
      title: 'Common ligatures',
      sample:  ligatures,
      style: [
        'font-variant: common-ligatures'
      ]
    },
  ],

  font_families = [
    {
      name: 'Source Serif Pro',
      url: 'https://fonts.googleapis.com/css2?family=Source+Serif',
      fontFamily: '\'Source Serif Pro\', serif'
    },
    {
      name: 'Source Sans Pro',
      url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro',
      fontFamily: '\'Source Sans Pro\', sans-serif'
    },
    {
      name: 'Roboto',
      url: 'https://fonts.googleapis.com/css?family=Roboto',
      fontFamily: 'Roboto, sans-serif'
    },
    {
      name: 'Roboto Condensed',
      url: 'https://fonts.googleapis.com/css?family=Roboto+Condensed',
      fontFamily: 'Roboto Condensed, sans-serif'
    },
    {
      name: 'Open Sans Condensed',
      url: 'https://fonts.googleapis.com/css?family=Open+Sans+Condensed',
      fontFamily: 'Open Sans Condensed, sans-serif'
    },
    {
      name: 'Inconsolata',
      url: 'https://fonts.googleapis.com/css?family=Inconsolata',
      fontFamily: 'Inconsolata, monospace'
    },
    {
      name: 'Lato',
      url: 'https://fonts.googleapis.com/css?family=Lato',
      fontFamily: 'Lato, sans-serif'
    },
    {
      name: 'Raleway',
      url: 'https://fonts.googleapis.com/css?family=Raleway',
      fontFamily: 'Raleway, sans-serif'
    },
    {
      name: 'Lobster',
      url: 'https://fonts.googleapis.com/css?family=Lobster',
      fontFamily: "'Lobster', cursive"
    },
    {
      name: 'Dancing Script',
      url: 'https://fonts.googleapis.com/css?family=Dancing+Script',
      fontFamily: "'Dancing Script', cursive"
    },
    {
      name: 'Barlow',
      url: 'https://fonts.googleapis.com/css?family=Barlow',
      fontFamily: "'Barlow', sans-serif"
    },
    {
      name: 'Helvetica Neue / Arial',
      url: null,
      fontFamily: "'Helvetica Neue', Arial, sans-serif"
    },
    {
      name: 'Zilla Slab',
      url: 'https://fonts.googleapis.com/css?family=Zilla+Slab',
      fontFamily: "'Zilla Slab', serif"
    }
  ],
  font_select = document.getElementById('font-family'),
  head = document.head,
  main = document.getElementsByTagName('main')[0],
  table = main.querySelector('.font-table');

  font_families.forEach( (item, idx) => {
    font_select.insertAdjacentHTML('beforeend',
      '<option data-idx="' + idx + '">' +
        item.name +
      '</option>'
    );
  });

  table.querySelector('.default_chars').innerHTML = `
    ${letters}<br>
    ${letters.toUpperCase()}<br>
    ${nums}<br>
    ${puncts_symbols}<br>
    ${diacritics} ${diacritics.toUpperCase()}<br>
    ${ligatures}<br>
    ${fractions}`;

  font_features.forEach( item => {

    let riga = document.createElement('tr');

    riga.insertAdjacentHTML('beforeend',
      `<th>${item.title}</th>
      <td class="sample">${item.sample}</td>
      <td class="sample-style">${item.style.join('<br>')}</td>`
    );
    riga.querySelector('.sample').style.cssText = item.style.join('');

    table.appendChild(riga);

  });

  const changeFont = (() => {
    let thisOption = font_select.options[font_select.selectedIndex],
    thisfont = font_families[thisOption.dataset.idx];

    if (thisfont.url && head.querySelector('[href="' + thisfont.url + '"') === null) {
      head.insertAdjacentHTML('beforeend',
        '<link href="' + thisfont.url + '" rel="stylesheet">'
      );
    }

    main.style.fontFamily = thisfont.fontFamily;

  });
  changeFont();
  font_select.onchange = changeFont;

})();

