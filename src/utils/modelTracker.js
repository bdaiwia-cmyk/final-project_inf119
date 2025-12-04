// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// this file tracks api usage for the models

import fs from 'fs';
import path from 'path';

// keep track of model usage
let modelUsage = {};

// initialize a model in our tracker
export function initializeModel(modelName) {
  // create entry if it doesnt exist
  if (!modelUsage[modelName]) {
    modelUsage[modelName] = {
      numApiCalls: 0,
      totalTokens: 0
    };
  }
}

// track when we call the api
export function trackApiCall(modelName, tokensUsed) {
  // make sure model exists first
  initializeModel(modelName);

  // add to the counters
  modelUsage[modelName].numApiCalls += 1;
  modelUsage[modelName].totalTokens += tokensUsed;

  console.log(`Tracked API call to ${modelName}: ${tokensUsed} tokens used`);
}

// get the current stats
export function getUsageStats() {
  // return copy so original doesnt get changed
  return JSON.parse(JSON.stringify(modelUsage));
}

// save stats to json file
export function saveUsageToFile(filepath = 'model_usage.json') {
  try {
    // turn into json string
    const jsonData = JSON.stringify(modelUsage, null, 2);

    // write it out
    fs.writeFileSync(filepath, jsonData);

    console.log(`Model usage saved to ${filepath}`);
  } catch (error) {
    console.error('Error saving model usage:', error.message);
  }
}

// reset everything
export function resetTracking() {
  modelUsage = {};
  console.log('Model tracking data reset');
}
