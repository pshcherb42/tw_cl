import mongoose, {model, models, Schema} from "mongoose";
import { type } from "node:os";

const LikeSchema = new Schema ({
    author: {type:mongoose.Types.ObjectId, ref: 'User'},
    post: {type:mongoose.Types.ObjectId, ref: 'Post'}
}, {
    timestamps: true,
});

const Like = models?.Like || model('Like', LikeSchema);

export default Like;