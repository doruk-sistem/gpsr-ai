import "server-only";

import { AzureOpenAI } from "openai";

const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

export const openai = new AzureOpenAI({
  apiKey: azureApiKey,
  deployment: deploymentName,
  endpoint: azureEndpoint,
  apiVersion,
});
