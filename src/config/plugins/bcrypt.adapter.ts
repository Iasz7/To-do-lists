import bcrypt from 'bcryptjs'

export const bcryptAdapter = {
    hash : (password : string) =>{
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt)
    },
    compare : (password : string, hashedPassword : string) => bcrypt.compareSync(password, hashedPassword)
} 