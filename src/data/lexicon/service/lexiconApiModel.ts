// To parse this data:
//
//   import { Convert, LexiconAPIResponse } from "./file";
//
//   const lexiconAPIResponse = Convert.toLexiconAPIResponse(json);
import '../model/Lexicon';
const {Lexicon} = require("../model/Lexicon");
export interface LexiconAPIResponse {
  status?:   boolean;
  response?: Response[];
}

export interface Response {
  guid?:      number;
  reference?: string;
  english?:   string;
  french?:    string;
  portable?:  boolean;

}

// Converts JSON strings to/from your types
export class Convert {
  public static toLexiconAPIResponse(json: string): LexiconAPIResponse {
    return JSON.parse(json);
  }

  public static lexiconAPIResponseToJson(value: LexiconAPIResponse): string {
    return JSON.stringify(value);
  }


}
