import { ListEntity } from ".";
import { CustomError } from "../errors/custom.error";

export class UserEntity {
    constructor(
        public id: string,
        public name:string,
        public email: string,
        public emailValidated: boolean,
        public password?: string,
        public lists?: ListEntity[]
    ){

    }

    static fromJSON(object: {[key: string]:any}){
        const{id,name,email,emailValidated,password,lists}= object;
        if(!id)     throw CustomError.badRequest("Missing id");
        if(!name)   throw CustomError.badRequest("Missing name");
        if(!email)  throw CustomError.badRequest("Missing email");
        if(!password)throw CustomError.badRequest("Missing password");
        if(emailValidated === undefined) throw CustomError.badRequest("Missing emailValidated");

        return new UserEntity(id,name,email,emailValidated,password,lists);
    }
}