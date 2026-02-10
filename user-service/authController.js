import User from './user.js';

export const registerUser = async (req, res) => {
    try {
        const { username, password, } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already in use" });
        }

        //create the User
        const user = await User.create({
            username,
            password,
            role: 'user'
        })

        res.status(201).json({ user })

    }
    catch (error) {
        console.log("error in registerUser in auth controller", error.message)
        res.status(500).json({ err: "Internal Server error", error: error.message })
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        console.log(user);
        if (!user || !(await user.comparePasswords(password))) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        res.status(200).json({ user });

    } catch (err) {
        res.status(500).json({ err: "Internal Server error", error: err.message });
        console.log("error in loginUser in auth controller", err.message);
    };

}

