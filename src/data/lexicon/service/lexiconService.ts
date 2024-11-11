// src/api/lexiconAPI.ts

import axios from 'axios';
import {Convert } from "@/data/lexicon/service/model/lexiconApiModel";
import   {Lexicon} from '@/data/lexicon/model/Lexicon';
import {Constant} from "@/app/constant/constant";
import type { Response } from "@/data/lexicon/service/model/lexiconApiModel";
/**
 * fetch lexicon data
 */
export async function fetchLexiconsFromApi(): Promise<Lexicon[] | null> {
  try {
    const response = await axios.get(`${Constant.APIENDPOINT}/lexicon/list_all`);

    const apiResponse = Convert.toLexiconAPIResponse(JSON.stringify(response.data));
    return Convert.toLexiconArray(apiResponse);

  } catch (error) {
    alert("Error when retrieving lexicons.");
    return null;
  }
}

/**
 * save lexicon
 * @param postData
 */
export async function saveLexicon(postData: Response): Promise<Lexicon | null> {
  try {
    const response = await axios.post(`${Constant.APIENDPOINT}/lexicon/add`, postData);
    const apiResponse = Convert.toLexiconAPIResponse(JSON.stringify(response.data));
    return Convert.toLexicon(apiResponse);
  } catch (error) {
    console.error("Error during lexicon registration:", error);
    return null;
  }
}

export async function updateLexicon(postData: Response): Promise<Lexicon | null> {
  try {
    const response = await axios.post(`${Constant.APIENDPOINT}/lexicon/add`, postData);
    const apiResponse = Convert.toLexiconAPIResponse(JSON.stringify(response.data));
    return Convert.toLexicon(apiResponse);
  } catch (error) {
    console.error("Error during lexicon update:", error);
    return null;
  }
}

export async function delLexicon(guidArray: (string | number)[]): Promise<void> {
  try {
    await axios.put(`${Constant.APIENDPOINT}/lexicon/delete`, { guids: guidArray });
  } catch (error) {
    console.error("Error when deleting the lexicon:", error);
    throw error;
  }
}


