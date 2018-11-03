export default function() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').then(reg => {
        reg.onupdatefound = function() {
          var installingSW = reg.installing;
          installingSW.onstatechange = function() {
            switch (installingSW.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  console.log('New content available');
                } else {
                  console.log('Content made available offline');
                }
                break;
              case 'redundant':
                console.log('Installing SW became redundant');
                break;
            }
          }
        }
      }).catch(err => console.log('Failed to register serviceWorker', err));
    })
  }
}
