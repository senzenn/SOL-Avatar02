// Solavatar Embed Script
(function() {
  // Initialize communication with iframe
  window.addEventListener('message', function(event) {
    // Verify origin
    if (event.origin !== process.env.NEXT_PUBLIC_APP_URL) return;

    const { type, data } = event.data;
    
    switch (type) {
      case 'SOLAVATAR_READY':
        console.log('Solavatar widget loaded');
        break;
      case 'SOLAVATAR_ERROR':
        console.error('Solavatar error:', data);
        break;
      case 'SOLAVATAR_MESSAGE':
        // Handle chat messages
        if (typeof window.onSolavatarMessage === 'function') {
          window.onSolavatarMessage(data);
        }
        break;
    }
  });

  // Expose public API
  window.Solavatar = {
    // Send message to avatar
    sendMessage: function(message) {
      const iframe = document.querySelector('iframe[src*="/embed/widget"]');
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'SEND_MESSAGE',
          data: message
        }, process.env.NEXT_PUBLIC_APP_URL);
      }
    },

    // Set callback for receiving messages
    onMessage: function(callback) {
      window.onSolavatarMessage = callback;
    },

    // Update widget configuration
    configure: function(config) {
      const iframe = document.querySelector('iframe[src*="/embed/widget"]');
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'UPDATE_CONFIG',
          data: config
        }, process.env.NEXT_PUBLIC_APP_URL);
      }
    }
  };
})(); 