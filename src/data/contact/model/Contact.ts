// src/models/contact.ts

import axios from "axios";
import {Constant} from "@/app/constant/constant";

class Contact {
  public id: number | undefined;
  public guid: number | null;
  public firstname: string;
  public lastname: string;
  public mobile: number | null;
  public whatsapp: number | null;
  public email: string;
  public gender: string;
  public language: string;
  public location: string;
  public qualified: boolean;
  public qualifiedBy: number | undefined;
  public qualifiedDate: Date | undefined;

  constructor(
    firstname: string,
    lastname: string,
    mobile: number | null,
    whatsapp: number | null,
    email: string,
    gender: string,
    language: string,
    location: string,
    qualified: boolean,
    qualifiedDate?: Date,
    qualifiedBy?: number,
    id?: number,
    guid?: number | null
  ) {
    this.id = id;
    this.guid = guid || null;
    this.firstname = firstname || '';
    this.lastname = lastname || '';
    this.mobile = mobile;
    this.whatsapp = whatsapp;
    this.email = email || '';
    this.gender = gender || '';
    this.language = language || '';
    this.location = location || '';
    this.qualified = qualified || false;
    this.qualifiedBy = qualifiedBy;
    this.qualifiedDate = qualifiedDate;
  }


  /**
   * get contacts data
   */
     static async  fetchContactsFromApi(){
    try {
      const response= await axios.get(`${Constant.APIENDPOINT}/contact/list_all`);
      if(!response.data) return [];
      return response.data.response;
    }
    catch (error){
      console.error('Error fetching contacts:', error);
      throw error;
    }
   }

  /**
   * delete contact
   */
  async deleteContact() {
    try {
      const response = await axios.put(`${Constant.APIENDPOINT}/contact/delete`, {
        guids: [this.guid]
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }


  private validateData() {
    if (!this.lastname) {
      throw new Error("Le champ 'Nom' est obligatoire.");
    }
    if (!this.mobile) {
      throw new Error("Le champ 'Mobile' est obligatoire.");
    }
    if (this.mobile && !String(this.mobile).match(/^\d{09}$/)) {
      throw new Error("Invalid mobile number format.");
    }
    if (this.email && !this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error("Invalid email format.");
    }
  }

  /**
   * prepare data to save
   * @private
   */
  private prepareContactData() {
    const contactData = {
      firstname: this.firstname.trim(),
      lastname: this.lastname.trim(),
      mobile: this.mobile,
      whatsapp: this.whatsapp || null,
      email: this.email.trim(),
      location: this.location.trim(),
      gender: this.gender.trim(),
      qualified: this.qualified,
      language: this.language.trim(),
      guid: this.guid
    };

    Object.keys(contactData).forEach(key => {
      if (contactData[key as keyof typeof contactData] === '' ||
        contactData[key as keyof typeof contactData] === null ||
        contactData[key as keyof typeof contactData] === undefined) {
        delete contactData[key as keyof typeof contactData];
      }
    });

    // (Object.entries(contactData) as [keyof typeof contactData, any][]).forEach(([key, value]) => {
    //   if (value === '' || value === null || value === undefined) {
    //     delete contactData[key];
    //   }
    // });

    return contactData;
  }

  /**
   * save or update contact
   */
  async saveOrUpdateContact() {
    try {
      // Validation des données
      this.validateData();

      if (!this.guid) {
        const existingContact = await this.checkContactExists();
        if (existingContact) {
          throw new Error("Un contact avec ce numéro de mobile ou email existe déjà.");
        }
      }
      const contactData = this.prepareContactData();

      console.log('Données envoyées au serveur:', contactData);

      const response = await axios.post(
        `${Constant.APIENDPOINT}/contact/add`,
        contactData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur détaillée:', error.response?.data);
        throw new Error(error.response?.data?.message || "Erreur lors de l'enregistrement du contact");
      }
      throw error;
    }
  }

  /**
   * check if contact exists
   */
  async checkContactExists(): Promise<boolean> {
    try {
      const response = await axios.put(`${Constant.APIENDPOINT}/contact/list`, {
        mobile: this.mobile,
        email: this.email,
      });

      if (response.data) {
        if (response.data.status === true && Array.isArray(response.data.response)) {
          return response.data.response.length > 0;
        } else if (response.data.status === false && response.data.message === 'list_is_empty') {
          return false;
        }
      }

      console.error('Format de réponse inattendu:', response.data);
      throw new Error('Format de réponse invalide');
    } catch (error) {
      console.error('Erreur lors de la vérification du contact:', error);
      throw error;
    }
  }

  async loadContactData(): Promise<boolean> {
    if (!this.guid) return false;

    try {
      const response = await axios.put(`${Constant.APIENDPOINT}/contact/list`, {
        guid: this.guid
      });

      if (response.data.status && response.data.response.length > 0) {
        const contactData = response.data.response[0];
        this.firstname = contactData.firstname;
        this.lastname = contactData.lastname;
        this.mobile = contactData.mobile;
        this.whatsapp = contactData.whatsapp;
        this.email = contactData.email;
        this.location = contactData.location;
        this.gender = contactData.gender;
        this.language = contactData.language;
        this.qualified = contactData.qualified;
        this.qualifiedBy = contactData.qualifiedBy;
        this.qualifiedDate = contactData.qualifiedDate;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors du chargement du contact:", error);
      throw error;
    }
  }


}

export { Contact };
