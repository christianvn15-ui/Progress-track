const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const overlayText = document.getElementById('overlayText');
const recordTimeInput = document.getElementById('recordTime');
const pushupsInput = document.getElementById('pushups');
const saveBtn = document.getElementById('saveBtn');
const installBtn = document.getElementById('installBtn');

let deferredPrompt;

// Update overlay text live
function updateOverlay() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const recordTime = recordTimeInput.value || '00:00';
  const pushups = pushupsInput.value || '0';

  overlayText.innerHTML = `${date}<br>${time}<br>${recordTime}<br>${pushups} Push-Ups`;
}

recordTimeInput.addEventListener('input', updateOverlay);
pushupsInput.addEventListener('input', updateOverlay);

// Handle image upload
fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      overlayText.style.display = 'flex';
      updateOverlay();
      saveBtn.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  }
});

// Save button: download final product
saveBtn.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Overlay background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const recordTime = recordTimeInput.value || '00:00';
    const pushups = pushupsInput.value || '0';

    ctx.fillText(date, canvas.width / 2, canvas.height / 2 - 60);
    ctx.fillText(time, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(recordTime, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(`${pushups} Push-Ups`, canvas.width / 2, canvas.height / 2 + 60);

    // Trigger download
    const link = document.createElement('a');
    link.download = 'progress-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };
  img.src = preview.src;
});

// PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('App installed');
        installBtn.style.display = 'none';
      } else {
        console.log('App dismissed');
      }
      deferredPrompt = null;
    });
  }
});