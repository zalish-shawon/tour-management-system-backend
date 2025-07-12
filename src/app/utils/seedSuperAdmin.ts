import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL});
        
        if (isSuperAdminExist) {
            console.log("Super Admin already exists");
            return;
        }

        console.log("Trying to create Super Admin...");

        const hashedPassword =  await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD as string, parseInt(envVars.BCRYPT_SALT_ROUNDS as string));

        const authProvider : IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL as string,

        }

        const payload: IUser = {
            name: "Super Admin",
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL as string,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider],
        }


        const superAdmin = await User.create(payload);
        console.log("Super Admin created successfully");
        console.log(superAdmin);

    } catch (error) {
        console.error(error);
        
    }
}   