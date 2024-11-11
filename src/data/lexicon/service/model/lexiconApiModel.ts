// src/models/lexiconResponse.ts
import {Lexicon} from "@/data/lexicon/model/Lexicon";

export interface LexiconAPIResponse {
  status?: boolean;
  response?: Response[];
}

export interface Response {
  guid?: number | null;
  reference?: string;
  english?: string;
  french?: string;
  portable?: boolean;
}

export interface Alert {
  id: string | number; // Typage de l'ID selon votre besoin
  title: string;
  message: string;
  type: 'success'| 'error';
}

// Converts JSON strings to/from your types
export class Convert {
  public static toLexiconAPIResponse(json: string): LexiconAPIResponse {
    return JSON.parse(json);
  }

  public static lexiconAPIResponseToJson(value: LexiconAPIResponse): string {
    return JSON.stringify(value);
  }

  public static toLexiconArray(apiResponse: LexiconAPIResponse): Lexicon[] {
    return apiResponse.response?.map(item => Lexicon.fromJson(item)) || [];
  }
  public static toLexicon(apiResponse: LexiconAPIResponse): Lexicon {
    return Lexicon.fromJson(apiResponse.response);
  }

}
