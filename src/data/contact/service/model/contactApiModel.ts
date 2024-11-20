// src/models/contactAPIResponse.ts
// import { Contact } from "@/data/contact/model/Contact";

// export interface ContactAPIResponse {
//   status?: boolean;
//   response?: Response[];
// }

// export interface Response {
//   guid?: number | undefined;
//   firstname?: string;
//   lastname?: string;
//   mobile?: number;
//   whatsapp?: number;
//   email?: string;
//   gender?: string;
//   language?: string;
//   location?: string;
//   qualified?: boolean;
// }

export interface Alert {
  id: string | number; // Typage de l'ID selon votre besoin
  title: string;
  message: string;
  type: 'success' | 'error';
}

/**
 * Interface pour la réponse de l'API
 */
// interface Response {
//   status: boolean;
//   response: Contact[];
// }

// Converts JSON strings to/from your types
// export class Convert {
//
//   /**
//    *   Convertit une chaîne JSON en un objet ContactAPIResponse
//     */
//   public static toContactAPIResponse(json: string): ContactAPIResponse {
//     return JSON.parse(json);
//   }
//
//   /**
//    * Convertit un objet ContactAPIResponse en chaîne JSON
//     */
//   public static contactAPIResponseToJson(value: ContactAPIResponse): string {
//     return JSON.stringify(value);
//   }
//
//   /**
//    *   Convertit une réponse API en un tableau de contacts
//     */
//   public static toContactArray(apiResponse: ContactAPIResponse): Contact[] {
//     return apiResponse.response?.map(item => Contact.fromJson(item)) || [];
//   }
//
//   /**
//    *   Convertit une réponse API en un seul contact
//    */
//   public static toContact(apiResponse: ContactAPIResponse): Contact {
//     return Contact.fromJson(apiResponse.response);
//   }
// }
