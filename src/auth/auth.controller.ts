import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    async signUp(@Res() res, @Body() signupDto: SignupDto): Promise<{ token: string }> {
        const { email } = signupDto;

        const existingUser = await this.authService.findByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = await this.authService.signUp(signupDto);
        return res.status(201).json(user);

    }

    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.authService.login(loginDto);
    }
}
