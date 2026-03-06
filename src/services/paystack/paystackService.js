/**
 * File: paystackService.js
 * Purpose: Handles Paystack specific operations via Pop-up.
 * Dependencies: Paystack script in index.html
 * Notes: Uses Pop-up implementation.
 */

/**
 * Initializes a Paystack transaction popup.
 *
 * @param {Object} config - Transaction configuration
 * @param {string} config.email - Customer email
 * @param {number} config.amount - Amount in kobo (NGN * 100)
 * @param {Object} config.metadata - Order metadata
 * @param {Function} config.onSuccess - Callback for successful transaction
 * @param {Function} config.onClose - Callback for closed window
 * @returns {void}
 *
 * Side Effects:
 * - Opens a Paystack modal window
 *
 * Edge Cases:
 * - Paystack script not loaded
 * - Invalid configuration
 */
const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
};

export const initPaystackPayment = async ({ email, amount, metadata, onSuccess, onClose }) => {
  try {
    await loadPaystackScript();
  } catch (error) {
    throw new Error('Paystack script is not loaded in the document. Please check your internet connection or disable adblockers.');
  }

  if (!window.PaystackPop) {
    throw new Error('Paystack pop initialization failed.');
  }

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  
  if (!publicKey) {
    throw new Error('Missing Paystack public key');
  }

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount,
    currency: 'NGN',
    metadata,
    callback: function(response) {
      if (onSuccess) onSuccess(response);
    },
    onClose: function() {
      if (onClose) onClose();
    }
  });
  
  handler.openIframe();
};
