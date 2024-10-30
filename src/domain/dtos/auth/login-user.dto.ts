import { regularExps } from "./regular-exp";

export class LoginUserDto {

    private constructor(
        public email: string,
        public password: string,
    ){}

    static create(obj: {[key: string]: any}): [string | null, LoginUserDto | null] {
        const {email, password} = obj;

        //email validations
        if (!email) return ['Missing email', null];
        if (!regularExps.email.test(email)) return ['Invalid email', null];
        //paswords validations
        if (!password) return ['Missing password', null];
        if (typeof password != "string"){
            return ['password must be a string', null]
        }
        if (password.length < 6 ) return ['Password must have 6 characters', null];

        return [null, new LoginUserDto(email, password)];
    }
} 