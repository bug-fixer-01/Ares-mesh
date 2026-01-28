import mongoose from "mongoose";

const connectToMongoDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to mongodb");
    }
    catch(error){
       console.log("error to connect to mongodb",error.message);
    }

}

export default connectToMongoDb;