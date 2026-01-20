import { client } from '@/client/client.gen';
import apiClient from '@/lib/axios';

client.instance = apiClient;

// Optional: Sync the Base URL just in case
// client.setConfig({ baseURL: apiClient.defaults.baseURL });