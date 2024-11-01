import { getUUID , bcryptAdapter, JwtGeneretor} from '../../config/plugins';
import { envs } from '../../config/plugins/envs';
import { prisma } from '../../data/postgres/init';
import { CustomError, UserEntity, RegisterUserDto, LoginUserDto } from '../../domain';
import { EmailService, SendMailOptions } from './email.service';


export class AuthService{
    constructor(private readonly emailService: EmailService){}
    public async registerUser( registerUserDto : RegisterUserDto){

        try {
            const existUser = await prisma.user.findUnique({where: {email: registerUserDto.email}});
            if(existUser)throw CustomError.badRequest('Other user already registered with same email');
            
            registerUserDto.password = bcryptAdapter.hash(registerUserDto!.password)
            const user = await prisma.user.create({data : {id: getUUID() , ...registerUserDto}})

            const {password, ...userNoPass} = UserEntity.fromJSON(user);
            const token = await JwtGeneretor.generateToken(userNoPass)
            
            this.sendValidationEmail(userNoPass.email);

            if(!token) throw CustomError.internalServerError('Error generating token');
            return {user: userNoPass, token}
        }catch(error:any){
            throw new CustomError('Error registering the user: ' + error, error.statusCode || 500)
        }
    }

    public async loginUser( loginUserDto : LoginUserDto){

        try {
            const user = await prisma.user.findUnique({where: {email: loginUserDto.email}});
            if(!user)throw CustomError.badRequest(`Email: ${loginUserDto.email} not found`);
            console.log(user);
            const isMatching = bcryptAdapter.compare(loginUserDto.password, user!.password)
            if(!isMatching)throw CustomError.badRequest('Password incorrect');
            
            const {password, ...userNoPass} = UserEntity.fromJSON(user);
            const token = await JwtGeneretor.generateToken(userNoPass)
            if(!token) throw CustomError.internalServerError('Error generating token');
            return {user: userNoPass, token}

        }catch(error:any){
            throw new CustomError("Error login the user: " + error, error.statusCode || 500)
        }
    }

    private async sendValidationEmail(email : string){
        const token = await JwtGeneretor.generateToken({email})
        if(!token) throw CustomError.internalServerError('Error generating token');

        const   link = `${envs.WEBSERVICE_URL}/auth/validate-mail/${token}`,
                htmlBody = `<h1>Validate your email</hi>
                        <p>Click the link below to validate your email:</p>
                        <a href="${link}">Validate your email: ${email}</a>`,
                mailOptions : SendMailOptions= {to: email, subject: 'Validation email', htmlBody};
                  
        this.emailService.sendEmail(mailOptions);
        // console.log(`Registration email sent to ${email}`);
    }

    public async validateEmail( token : string){
        try {
            const payload = await JwtGeneretor.verifyToken<UserEntity>(token)
            if(!payload || payload.email === undefined) throw CustomError.unauthorized();

            const user = await prisma.user.update({where: {email: payload.email}, data: {emailValidated: true}})
            if(!user) throw CustomError.internalServerError('Email not registered');

            return user;
        }catch(error:any){
            throw new CustomError("Error validating email: " + error, error.statusCode || 500)
        }
    }
}