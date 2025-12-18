import {model, models, Schema} from "mongoose";    

const UserSchema = new Schema( {
    name: String,
    email: String,
    image: String,
    username: String,
});

const User = models?.User || model('User', UserSchema); // if we dont have a model we create a new one

export default User;