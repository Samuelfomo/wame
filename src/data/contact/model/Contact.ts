// src/models/contact.ts

class Contact {
  public id: number;
  public guid: string;
  public firstname: string;
  public lastname: string;
  public mobile: number;
  public whatsapp: number;
  public email: string;
  public gender: string;
  public language: string;
  public location: string;
  public qualified: boolean;

  constructor(
    firstname: string,
    lastname: string,
    mobile: number,
    whatsapp: number,
    email: string,
    gender: string,
    language: string,
    location: string,
    qualified: boolean,
    id?: number,
    guid?: string
  ) {
    this.id = id || 0;
    this.guid = guid || '';
    this.firstname = firstname;
    this.lastname = lastname;
    this.mobile = mobile;
    this.whatsapp = whatsapp;
    this.email = email;
    this.gender = gender;
    this.language = language;
    this.location = location;
    this.qualified = qualified;
  }

  // Méthode statique pour convertir un objet JSON en une instance de Contact
  public static fromJson(json: any): Contact {
    return new Contact(
      json.firstname,
      json.lastname,
      json.mobile,
      json.whatsapp,
      json.email,
      json.gender,
      json.language,
      json.location,
      json.qualified,
      json.id,
      json.guid
    );
  }

  // Méthode pour convertir l'objet Contact en un objet JSON
  public toJson(): any {
    return {
      guid: this.guid,
      firstname: this.firstname,
      lastname: this.lastname,
      mobile: this.mobile,
      whatsapp: this.whatsapp,
      email: this.email,
      gender: this.gender,
      language: this.language,
      location: this.location,
      qualified: this.qualified
    };
  }
}

export { Contact };
