import { regularExps } from "./regular-exp";

export class LoginUserDto {

    private constructor(
        public email: string,
        public password: string,
    ){}

    static create(obj: {[key: string]: any}): [string | null, LoginUserDto | null] {
        const {email, password} = obj;

        if (!email)                         return ['Missing email', null];
        if (!password)                      return ['Missing password', null];
        if (!regularExps.email.test(email)) return ['Invalid email', null];
        if (password.length < 6 )           return ['Password must have 6 characters', null];

        return [null, new LoginUserDto(email, password)];
    }
} 