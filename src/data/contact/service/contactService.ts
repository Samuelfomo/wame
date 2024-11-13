// src/api/contactAPI.ts

import axios from 'axios';
import { Convert } from "@/data/contact/service/model/contactApiModel";
import { Contact } from '@/data/contact/model/Contact';
import { Constant } from "@/app/constant/constant";
import type { Response } from "@/data/contact/service/model/contactApiModel";

/**
 * Fetch contact data
 */
export async function fetchContactsFromApi(): Promise<Contact[] | null> {
  try {
    const response = await axios.get(`${Constant.APIENDPOINT}/contact/list_all`);

    const apiResponse = Convert.toContactAPIResponse(JSON.stringify(response.data));
    return Convert.toContactArray(apiResponse);

  } catch (error) {
    alert("Error when retrieving contacts.");
    return null;
  }
}

/**
 * Save contact
 * @param postData
 */
export async function saveContact(postData: Response): Promise<Contact | null> {
  try {
    const response = await axios.post(`${Constant.APIENDPOINT}/contact/add`, postData);
    const apiResponse = Convert.toContactAPIResponse(JSON.stringify(response.data));
    return Convert.toContact(apiResponse);
  } catch (error) {
    console.error("Error during contact registration:", error);
    return null;
  }
}

/**
 * Update contact
 * @param postData
 */
export async function updateContact(postData: Response): Promise<Contact | null> {
  try {
    const response = await axios.post(`${Constant.APIENDPOINT}/contact/add`, postData);
    const apiResponse = Convert.toContactAPIResponse(JSON.stringify(response.data));
    return Convert.toContact(apiResponse);
  } catch (error) {
    console.error("Error during contact update:", error);
    return null;
  }
}

/**
 * Delete contact
 * @param guidArray
 */
export async function deleteContact(guidArray: (string | number)[]): Promise<void> {
  try {
    await axios.put(`${Constant.APIENDPOINT}/contact/delete`, { guids: guidArray });
  } catch (error) {
    console.error("Error when deleting the contact:", error);
    throw error;
  }
}
