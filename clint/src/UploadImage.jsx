import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UploadImage = () => {
    const [name, setName] = useState("");
    const [imagefile, setImagefile] = useState(null);
    const [loading, setLoading] = useState(false);
    const Navigate =  useNavigate();
    const AddDate = async(e)=>{
        e.preventDefault();
        
        if(!imagefile || !name){
            return toast.warn("Add all field")
        }
        try {
            setLoading(true)
            let formData = new FormData();
            formData.append('image', imagefile);
            formData.append('name', name);
            const response = await fetch("/api/sendImage",{
                method:"POST",
                body:formData,
            })
            if(response.ok){
                setImagefile(null)
                setName("")
                toast.success("Data successfully added")
                setLoading(false)
                return Navigate("/views")
            }else{
                setImagefile(null)
                setName("")
                setLoading(false)
                return toast.error("data not submit")
            }
        } catch (error) {
            setLoading(false)
            return toast.error("fetch error :: /404")
        }
    }
    useEffect(() => {

    }, [imagefile]);
    if (loading) {
        return <div className="loaderdiv">Uploading ...<br/><br/><span className="loader"></span></div>
    }
    return (
        <>
            <div className="imageDiv">
                <div className="fiximagediv">
                    <img src={imagefile ? URL.createObjectURL(imagefile) : ""}  style={{display: !imagefile ? "none" : "block"}} alt="" />
                    <h1>{name}</h1>
                </div>
                <form id="imageTextForm" onSubmit={AddDate} encType="multipart/form-data">
                    <div>
                        <div className="form-group">
                            <label htmlFor="imageFile">Upload Image:</label>
                            <input type="file" id="imageFile" name="image" accept="image/*" onChange={(e) => { setImagefile(e.target.files[0]) }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="textInput">Enter Text:</label>
                            <input type="text" id="textInput" name="name" value={name} onChange={(e) => { setName(e.target.value) }} />
                        </div>
                        <div className="form-group2">
                            <button type="submit">Submit</button>
                            <Link to={"/views"} className="buttonlink">View..</Link>
                        </div>
                    </div>
                </form>

            </div>
        </>
    )
}
export default UploadImage;