  function toggleSwitchRedLight(toggle) {
    var switchElement = toggle.querySelector('.switch');
    switchElement.classList.toggle('off-red-light');
  }

  function toggleSwitchLight(toggle) {
    var switchElement = toggle.querySelector('.switch');
    switchElement.classList.toggle('off-light');
  }

  function toggleSwitchRedDark(toggle) {
    var switchElement = toggle.querySelector('.switch');
    switchElement.classList.toggle('off-red-dark');
  }

  function toggleSwitchDark(toggle) {
    var switchElement = toggle.querySelector('.switch');
    switchElement.classList.toggle('off-dark');
  }