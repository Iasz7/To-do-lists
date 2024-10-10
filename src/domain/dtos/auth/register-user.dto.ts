import { regularExps } from "./regular-exp";

export class RegisterUserDto {

    private constructor(
        public name: string,
        public email: string,
        public password: string,
    ){}

    static create(obj: {[key: string]: any}): [string | null, RegisterUserDto | null] {
        const {name, email, password} = obj;
        
        if (!name)                          return ['Missing name', null];
        if (!email)                         return ['Missing email', null];
        if (!password)                      return ['Missing password', null];
        if (!regularExps.email.test(email)) return ['Invalid email', null];
        if (password.length < 6 )           return ['Password must have 6 characters', null];

        return [null, new RegisterUserDto(name, email, password)];
    }
} 