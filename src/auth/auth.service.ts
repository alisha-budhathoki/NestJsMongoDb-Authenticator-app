import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schemas';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async signUp(signUpDto: SignupDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto
        const hashedpassword = await bcrypt.hash(password, 10)

        const user = await this.userModel.create({
            name,
            email,
            password: hashedpassword,
        });

        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto

        const user = await this.userModel.findOne({ email })

        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const iPasswordMatched = await bcrypt.compare(password, user.password)

        if (!iPasswordMatched) {
            throw new UnauthorizedException('Invaild password or email')
        }
        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }
}
