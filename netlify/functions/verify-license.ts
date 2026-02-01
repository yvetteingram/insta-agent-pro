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

  // Ensure this EXACTLY matches the permalink in your Gumroad dashboard (the URL part)
  const PRODUCT_PERMALINK = process.env.GUMROAD_PRODUCT_PERMALINK || 'instaagent-pro';

  try {
    const params = new URLSearchParams({
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
          error: data.message || 'Invalid or deactivated license key. Check your permalink settings.' 
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

