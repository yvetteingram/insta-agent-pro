import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { licenseKey } = JSON.parse(event.body || '{}');

  if (!licenseKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'License key is required' }),
    };
  }

  // Configuration must be set in Netlify environment variables
  const PRODUCT_PERMALINK = process.env.GUMROAD_PRODUCT_PERMALINK;
  const PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID;

  if (!PRODUCT_PERMALINK || !PRODUCT_ID) {
    console.error('Server Configuration Error: GUMROAD_PRODUCT_PERMALINK or GUMROAD_PRODUCT_ID is not defined in environment variables.');
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Server configuration error. Please contact support.' }),
    };
  }

  try {
    const params = new URLSearchParams({
      product_id: PRODUCT_ID,
      product_permalink: PRODUCT_PERMALINK,
      license_key: licenseKey,
    });

    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    // Log the response for debugging in the Netlify dashboard
    if (!data.success) {
      console.warn('Gumroad verification failed for key:', licenseKey.substring(0, 8) + '...', 'Reason:', data.message || 'Unknown');
    }

    if (data.success && !data.purchase.refunded && !data.purchase.chargebacked) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'License verified successfully' }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ 
          success: false, 
          error: data.message || 'Invalid or deactivated license key.' 
        }),
      };
    }
  } catch (error) {
    console.error('Gumroad Verification Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal verification error' }),
    };
  }
};
