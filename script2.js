document.addEventListener('DOMContentLoaded', function () {
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 '.split('');
  let beginStr = 'HELLO WORLD'.toUpperCase().split('');
  let endStr = [];
  const speed = 0.2; // Animation speed in seconds

  // Function to adjust the DOM for the flaps
  function adjustFlapsToTextLength() {
    const div = document.querySelector('.center');
    div.innerHTML = ''; // Clear existing flaps
    const maxLength = Math.max(beginStr.length, endStr.length);
    for (let i = 0; i < maxLength; i++) {
      const flap = document.createElement('div');
      flap.className = 'splitflap';
      flap.innerHTML =
        '<div class="top"></div><div class="bottom"></div><div class="nextHalf"></div><div class="nextFull"></div>';
      div.appendChild(flap);
    }
    setupAnimationDuration();
  }

  // Setup animation duration for elements
  function setupAnimationDuration() {
    const flaps = document.querySelectorAll('.splitflap');
    flaps.forEach(flap => {
      const bottom = flap.querySelector('.bottom');
      const nextHalf = flap.querySelector('.nextHalf');
      bottom.style.animationDuration = `${speed}s`;
      nextHalf.style.animationDuration = `${speed}s`;
    });
  }

  // Revised flipIt function
  function flipIt(index, targetChar) {
    const flaps = document.querySelectorAll('.splitflap');
    if (index >= flaps.length) return; // Guard clause

    let currentCharIndex = char.indexOf(beginStr[index]);
    const targetCharIndex = char.indexOf(targetChar);

    const performFlip = () => {
      currentCharIndex = (currentCharIndex + 1) % char.length;
      const nextChar = char[currentCharIndex];

      // Grab references to the elements needed for the animation
      const top = flaps[index].querySelector('.top');
      const bottom = flaps[index].querySelector('.bottom');
      const nextFull = flaps[index].querySelector('.nextFull');
      const nextHalf = flaps[index].querySelector('.nextHalf');

      // Set the content for the 'flipping' part of the flap
      nextHalf.innerHTML = nextChar;
      nextFull.innerHTML = nextChar;

      // Initiate the flip animation
      bottom.classList.remove('flip1');
      void bottom.offsetWidth; // Trigger reflow to restart the animation
      bottom.classList.add('flip1');

      nextHalf.classList.remove('flip2');
      void nextHalf.offsetWidth; // Trigger reflow to restart the animation
      nextHalf.classList.add('flip2');

      // Update the static part of the flap at the end of the animation
      bottom.addEventListener(
        'animationend',
        function () {
          top.innerHTML = nextChar;
          bottom.innerHTML = nextChar;

          // Remove the event listener to prevent memory leaks
          bottom.removeEventListener('animationend', arguments.callee);
        },
        { once: true }
      );

      // Continue flipping if we haven't reached the target character
      if (currentCharIndex !== targetCharIndex) {
        setTimeout(performFlip, speed * 1000);
      } else {
        beginStr[index] = targetChar; // Update the beginStr with the target character
      }
    };

    performFlip();
  }

  // Main animation loop
  function startAnimation() {
    let currentIndex = 0; // Initialize currentIndex
    adjustFlapsToTextLength(); // Ensure flaps are adjusted for current beginStr
    const intervalId = setInterval(() => {
      if (currentIndex < endStr.length) {
        const currentChar = endStr[currentIndex];
        flipIt(currentIndex, currentChar);
        currentIndex++;
      } else {
        clearInterval(intervalId);
        beginStr = endStr.slice(); // Update beginStr to match the newly set endStr
      }
    }, speed * 1000);
  }

  // Change the destination of the animation
  function changeDestination(newText) {
    endStr = newText.toUpperCase().split('');
    startAnimation();
  }

  // Initialize and start the animation
  adjustFlapsToTextLength();
  setupAnimationDuration();

  // Event listener for changing text
  document.getElementById('changeText').addEventListener('click', () => {
    const newText = document.getElementById('newText').value;
    changeDestination(newText);
  });
});
