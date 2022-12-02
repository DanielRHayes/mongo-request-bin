import axios from 'axios';
import { getResetUrl } from './helpers/urls';

export async function resetBin(baseUrl: string, password: string) {
  const resetUrl = getResetUrl(baseUrl);
  const response = await axios.post(resetUrl, { password });
  return response.data;
}
