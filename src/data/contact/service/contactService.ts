// src/api/contactAPI.ts

import axios from 'axios';
// import { Convert } from "@/data/contact/service/model/contactApiModel";
import { Contact } from '@/data/contact/model/Contact';
import { Constant } from "@/app/constant/constant";
// import type { Response } from "@/data/contact/service/model/contactApiModel";

/**
 * Fetch contact data
 */
// export async function fetchContactsFromApi(): Promise<Contact[] | null> {
//   try {
//     const response = await axios.get(`${Constant.APIENDPOINT}/contact/list_all`);
//
//     // const apiResponse = Convert.toContactAPIResponse(JSON.stringify(response.data));
//     // return Convert.toContactArray(apiResponse);
//
//     return response.data.response;
//
//   } catch (error) {
//     alert("Error when retrieving contacts.");
//     return null;
//   }
// }

/**
 * Save contact
 * @param postData
 */
// export async function saveContact(postData: Response): Promise<Contact | null> {
//   try {
//     const response = await axios.post(`${Constant.APIENDPOINT}/contact/add`, postData);
//     // const apiResponse = Convert.toContactAPIResponse(JSON.stringify(response.data));
//     // return Convert.toContact(apiResponse);
//     return response.data;
//   } catch (error) {
//     console.error("Error during contact registration:", error);
//     return null;
//   }
// }

/**
 * Update contact
 * @param postData
 */
// export async function updateContact(postData: Response): Promise<Contact | null> {
//   try {
//     const response = await axios.post(`${Constant.APIENDPOINT}/contact/add`, postData);
//     const apiResponse = Convert.toContactAPIResponse(JSON.stringify(response.data));
//     return Convert.toContact(apiResponse);
//
//   } catch (error) {
//     console.error("Error during contact update:", error);
//     return null;
//   }
// }

/**
 * Delete contact
 * @param guidArray
 */
// export async function deleteContact(guidArray: (string | number)[]): Promise<void> {
//   try {
//     await axios.put(`${Constant.APIENDPOINT}/contact/delete`, { guids: guidArray });
//   } catch (error) {
//     console.error("Error when deleting the contact:", error);
//     throw error;
//   }
// }

/**
 * get contact by guid
 * @param guid
 */
// export async function fetchContactByGuid(guid: number): Promise<Contact | null> {
//   try {
//     const response = await axios.put(`${Constant.APIENDPOINT}/contact/list`, {
//       guid: guid
//     });
//
//     // Vérification de la réponse { status: boolean, response: Contact[] }
//     if (response.data.status && response.data.response.length > 0) {
//       // Retourne le premier élément du tableau response
//       return response.data.response[0];
//     }
//     return null;
//   } catch (error) {
//     console.error("Erreur lors de la récupération du contact:", error);
//     return null;
//   }
// }

/**
 * get element exist
 * @param mobile
 * @param email
 */
// export async function fetchContactExist(mobile: number, email: string): Promise<boolean> {
//   try {
//     const response = await axios.put(`${Constant.APIENDPOINT}/contact/list`, {
//       mobile: mobile,
//       email: email
//     });
//
//     console.log("Contact Exist Check - Response:", response.data);
//     console.log("Status:", response.data.status);
//     console.log("Response Length:", response.data.response.length);
//
//     // On retourne true si on trouve des contacts correspondants
//     return response.data.status && response.data.response.length > 0;
//   } catch (error) {
//     console.log("Erreur lors de la vérification du contact:", error);
//     return false;
//   }
// }

// export async function fetchContactByGuid(guid: number): Promise<Contact | null> {
//   try {
//     const response = await axios.get(`${Constant.APIENDPOINT}/contact/list/${guid}`);
//     return response.data;
//   } catch (error) {
//     console.error("Erreur lors de la récupération du contact:", error);
//     return null;
//   }
// }
