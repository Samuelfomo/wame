

import axios from "axios";
import {Constant} from "@/app/constant/constant"

/**
 * connection adapter
 */
class LoginAdapter{
    public id: number;
    public guid: number | null;
    public name: string;
    public manager: string;
    public email: string;
    public password: string;

    constructor(
        id: number,
        guid: number | null,
        name: string,
        manager: string,
        email: string,
        password: string,
    ) {
        this.id = id;
        this.guid = guid;
        this.name = name;
        this.manager = manager;
        this.email = email;
        this.password = password;
    }

    /**
     * Connection method
     */
    async login() {
        try {
            const response = await axios.put(`${Constant.APIENDPOINT}/enterprise/list`, {
                email: this.email,
                password: this.password,
            });

            if (response.data && response.status === 200) {
                return response.data;
            }
            throw new Error('Invalid server response');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                switch (status) {
                    case 400:
                        throw new Error("Please complete all fields");
                    case 401:
                        throw new Error("Invalid password");
                    case 404:
                        throw new Error("No user found");
                    default:
                        throw new Error(error.response?.data?.message || "Error during connection");
                }
            }
            throw error;
        }
    }

    /**
     * Login data validation
     */
    validateLoginData() {
        if(!this.email && !this.password){
            throw new Error("Please complete all fields");
        }

        if (!this.email) {
            throw new Error("The 'Email' field is required.");
        }
        if (!this.password) {
            throw new Error("The 'Password' field is required.");
        }
        if (!this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            throw new Error("Invalid e-mail format.");
        }
    }


}

export {LoginAdapter};
