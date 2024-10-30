import { regularExps } from "./regular-exp";

export class RegisterUserDto {

    private constructor(
        public name: string,
        public email: string,
        public password: string,
    ){}

    static create(obj: {[key: string]: any}): [string | null, RegisterUserDto | null] {
        const {name, email, password} = obj;
        // name validations
        if (!name)                          return ['Missing name', null];
        if (typeof name != "string"){
            return ['name must be a string', null]
        }
        //email validations
        if (!email)                         return ['Missing email', null];
        if (!regularExps.email.test(email)) return ['Invalid email', null];
        //paswords validations
        if (!password)                      return ['Missing password', null];
        if (typeof password != "string"){
            return ['name must be a string', null]
        }
        if (password.length < 6 )           return ['Password must have 6 characters', null];

        return [null, new RegisterUserDto(name, email, password)];
    }
} 