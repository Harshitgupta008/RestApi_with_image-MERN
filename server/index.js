import express from "express";
import mongoose from "mongoose";
import multer from "multer"
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv"

const app = express();
dotenv.config();
const port = 3000 || 4000;

app.use(express.json());
const Db = process.env.MONGO_URL;
const Date = async () => {
    try {
        await mongoose.connect(Db);
        console.log("done mongo part");
    } catch (error) {
        console.log("error in mongo part :: " + error)
    }
}
Date();

const UserShema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: {},
}, { timestamps: true });

const User = mongoose.model("ImageUser", UserShema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {

        cb(null, `${Date.now} - ${file.originalname}`)
    }
})

const upload = multer({ storage: storage })


cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});


app.post("/api/sendImage", upload.single('image'), async (req, res) => {
    if (!req.body.name || !req.file) {
        return res.status(400).send("all field mendetry");
    }
    try {
        const uploadResult = await cloudinary.uploader
            .upload(req.file.path)
            .catch((error) => {
                console.log(error);
            });
        const response = await new User({
            name: req.body.name,
            image: { url: uploadResult.secure_url, cloudId: uploadResult.public_id }
        })
        if (response) {
            await response.save();
            fs.unlinkSync(req.file.path);
            return res.status(200).send("data send");
        } else {
            fs.unlinkSync(req.file.path);
            return res.status(400).send("data not send");

        }


    } catch (error) {
        console.log("error in postiage part :: " + error)
        return res.status(400).send("data not send");
    }

})

app.get("/api/getImage", async (req, res) => {
    try {
        const msg = await User.find({});
        if (msg) {
            return res.status(200).json({ msg });
        } else {
            console.log("error in data not found part :: ")
            return res.status(400).send("data not found");
        }
    } catch (error) {
        console.log("error in getImage part :: " + error)
        return res.status(400).send("data not found");
    }
})
app.delete("/api/deleteImage/:id/:cloudId", async (req, res) => {
    const _id = req.params.id;
    const cloudId = req.params.cloudId;
    try {
        const response = await User.findOne({ _id });
        if (response) {

            await cloudinary.uploader.destroy(cloudId).then(result => console.log(result));

            await User.findByIdAndDelete(_id);
            return res.status(200).send("data deleted");
        } else {
            console.log("id not found");
            return res.status(401).send("id not found")
        }
    } catch (error) {
        console.log("error in deleteImage part :: " + error)
        return res.status(400).send("data not found");
    }
})

// get Owner detail

app.get("/api/getOwner/:id", async (req, res) => {
    const _id = req.params.id;
    // console.log(_id)
    try {
        const findUser = await User.findById({ _id });
        if (findUser) {
            return res.status(200).send(findUser);
        } else {
            return res.status(404).send("user Not found")
        }

    } catch (error) {
        console.log("error in getOwner part :: " + error)
        return res.status(400).send("user Not found")
    }
})

// update image and user  //we use post for update if we handle image 
app.post("/api/updateUser", upload.single('image'), async (req, res) => {
   
    const {_id, cloudId, name} = req.body
    console.log(cloudId)
    try {
        const check = await User.findById({ _id });

        if (check) {
            if (req.file) {

                await cloudinary.uploader.destroy(cloudId).then(result => console.log(result));
                const uploadResult = await cloudinary.uploader
                    .upload(req.file.path)
                    .catch((error) => {
                        console.log(error);
                    });
                console.log(uploadResult.public_id)
                
                if (uploadResult) {
                    check.name = req.body.name;
                    check.image = {url: uploadResult.secure_url,cloudId : uploadResult.public_id} ;
                    
                    await check.save();
                    fs.unlinkSync(req.file.path);
                    return res.status(200).send("User updated successfully");
                } else {
                    fs.unlinkSync(req.file.path);
                    return res.status(400).send("not update")
                }
            } else {
                check.name = req.body.name;
                await check.save();
                return res.status(200).send("User updated successfully");
            }
        } else {
            return res.status(404).send("not found")
        }
    } catch (error) {
        console.log("error in updateUser part :: " + error)
        return res.status(400).send("user Not found")
    }
})



app.listen(port, () => {
    console.log("server run on port :: " + port)
})