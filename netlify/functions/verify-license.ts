
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

  // NOTE: In a real production environment, you would store your Gumroad Product Permalink
  // in an environment variable like GUMROAD_PRODUCT_PERMALINK.
  const PRODUCT_PERMALINK = process.env.GUMROAD_PRODUCT_PERMALINK || 'instaagent-pro';

  try {
    // Gumroad API URL for license verification
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_permalink: PRODUCT_PERMALINK,
        license_key: licenseKey,
      }),
    });

    const data = await response.json();

    if (data.success && !data.purchase.refunded && !data.purchase.chargebacked) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'License verified successfully' }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, error: 'Invalid or deactivated license key' }),
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
