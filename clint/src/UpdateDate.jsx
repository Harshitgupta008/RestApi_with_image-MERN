import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";

const UpdateDate = () => {
    const [imagefile, setImagefile] = useState(null);
    const [data,setDate] = useState({
        _id:"",name:"",image:{}
    });
    const [loading,setLoading] = useState(true);
    const { action } = useParams();
    const Navigate =  useNavigate();

    const FetchData = async ()=>{
        try {
            const response = await fetch(`/api/getOwner/${action}`,{
                method:"GET"
            })
            if(response.ok){
                const fix = await response.json();
                setDate({_id:fix._id,name:fix.name, image:{url:fix.image.url, cloudId : fix.image.cloudId}})            
                setLoading(false)
            }else if(response.status === 404){
                window.alert("user Not found");
                return Navigate("/views");
            }
        } catch (error) {
            return console.log("fetct error :: "+error);
        }
        
    }
    const handeinput = (e)=>{
        const {name,value} = e.target;
        setDate({...data,[name]:value});
    }
    const SaveDate = async (e)=>{
        e.preventDefault();

        try {
            let formdata = new FormData();
            formdata.append("image",imagefile)
            formdata.append("name",data.name)
            formdata.append("cloudId",data.image.cloudId);
            formdata.append("_id",data._id);

            const response = await fetch(`/api/updateUser`,{
                method:"POST",
                body:formdata,
            })
            if(response.ok){
                window.alert("Date Update");
                return Navigate("/views");
            }else{
                return console.log("user not found")
            }
        } catch (error) {
            return console.log("error fetch :: "+error)
        }
    }
    
    useEffect(() => {
        FetchData();
    }, [imagefile]);
    if (loading) {
        return <div className="loaderdiv"><span className="loader"></span></div>
    }
    return (
        <>
            <div className="imageDiv">
                <div className="fiximagediv">
                    <img src={imagefile ? URL.createObjectURL(imagefile) : ""}  style={{display: !imagefile ? "none" : "block"}} alt="" />
                    <h1>{data.name}</h1>
                </div>
                <form id="imageTextForm" onSubmit={SaveDate} encType="multipart/form-data">
                    <div>
                        <div className="form-group">
                            <label htmlFor="imageFile">Upload Image:</label>
                            <input type="file" id="imageFile" name="image" accept="image/*" onChange={(e)=>setImagefile(e.target.files[0])} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="textInput">Enter Text:</label>
                            <input type="text" id="textInput" name="name" value={data.name} onChange={handeinput} />
                        </div>
                        <div className="form-group2">
                            <button type="submit">Save</button>
                        </div>
                    </div>
                </form>

            </div>
        </>
    )
}
export default UpdateDate;