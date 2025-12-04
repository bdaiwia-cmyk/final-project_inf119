// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// error handling stuff

// retry a function if it fails
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // try running the function
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed: ${error.message}`);

      // if this was the last try, give up
      if (i === maxRetries - 1) {
        throw lastError;
      }

      // wait before trying again
      const waitTime = delay * Math.pow(2, i);
      console.log(`Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// check if required fields are there
export function validateRequiredFields(obj, requiredFields) {
  for (const field of requiredFields) {
    if (!obj[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// parse json but dont crash if it fails
export function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    return defaultValue;
  }
}
