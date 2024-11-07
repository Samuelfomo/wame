class Lexicon {
  public id: number;
  public guid: string;
  public reference: string;
  public english: string;
  public french: string;
  public portable: boolean;

  constructor(
    reference: string,
    english: string,
    french: string,
    portable: boolean,
    id?: number,
    guid?: string
  ) {
    this.id = id || 0;
    this.guid = guid || '';
    this.reference = reference;
    this.english = english;
    this.french = french;
    this.portable = portable;
  }

  public static fromJson(json: any): Lexicon {
    return new Lexicon(
      json.reference,
      json.english,
      json.french,
      json.portable,
      json.id,
      json.guid
    );
  }

  public toJson(): any {
    return {
      guid: this.guid,
      reference: this.reference,
      english: this.english,
      french: this.french,
      portable: this.portable
    };
  }
}

export { Lexicon };
