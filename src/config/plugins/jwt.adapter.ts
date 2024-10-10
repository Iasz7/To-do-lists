import jwt from 'jsonwebtoken'
import { envs } from './envs'

const JWT_SEED = envs.JWT_SEED

export default class JwtGeneretor{

    static generateToken(payload: any, duration : string = '2h'){
        return new Promise((resolve, reject)=>{
            jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
                if(err){
                    reject(err)
                }
                resolve(token)
            })
        })
    }

    static verifyToken(token: string): any{}
}