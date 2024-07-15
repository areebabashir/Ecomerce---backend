import users from "../models/userModel.js"
import { hashPassword, comparePassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        //validations
        if (!name) {
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ error: "Email is Required" });
        }
        if (!password) {
            return res.send({ error: "Password is Required" });
        }
        if (!phone) {
            return res.send({ error: "Phone no is Required" });
        }
        if (!address) {
            return res.send({ error: "Address is Required" });
        }
        if (!answer) {
            return res.send({ error: "Answer is Required" });
        }
        //check user
        const exisitingUser = await users.findOne({ email });
        //exisiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: true,
                message: "Already Register please login",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new users({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Errro in Registeration",
            error,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.find();
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


//loginnnnnn
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                adddress: user.address,
                role: user.role
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};


//forgotPasswordController);

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            return res.status(404).send({
                success: false,
                message: "Email is require",
            });
        }
        if (!answer) {
            return res.status(404).send({
                success: false,
                message: "answer is require",
            });
        } if (!newPassword) {
            return res.status(404).send({
                success: false,
                message: "newPassword is require",
            });
        }
        ///////checkkkkkkkkkkkkkkkkkkk
        const user = await users.findOne({ email, answer })
        ///////////////validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "wrong email or answer",
            });
        }

        const hashed = await hashPassword(newPassword);
        await users.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "password reset sucessfull",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error" + error

        });
    }
}



//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};
//update prfole
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const userId = req.user._id;

        // Fetch the current user
        const user = await users.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate the new password, if provided
        if (password && password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Hash the new password if provided
        const hashedPassword = password ? await hashPassword(password) : undefined;

        // Update the user fields
        const updatedUser = await users.findByIdAndUpdate(
            userId,
            {
                name: name || user.name,
                email: email || user.email,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true } // Return the updated document
        );

        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating profile",
            error,
        });
    }
};