import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Delete from "./img/delete.png"
import Update from "./img/iupdate.png"
import UpdateDate from "./UpdateDate";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Views = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { action } = useParams();

    const FetchData = async () => { 
        try {
            const response = await fetch("/api/getImage", {
                method: "GET",
            })
            if (response.ok) {
                const fix = await response.json();
                setData(fix.msg);
                return setLoading(false)
            }
        } catch (error) {
            return console.log("error fetch " + error)
        }
    }
    const DeleteData = async (id, cloudId) => {
        try {
            toast.info("Processing ...")
            const response = await fetch(`/api/deleteImage/${id}/${cloudId}`, {
                method: "DELETE",
            })
            if (response.ok) {
                return toast.success("Data Deleted")
            } else if (response.status === 401) {
                return toast.error("data not found")
            } else {
                return window.alert("error found")
            }
        } catch (error) {
            return window.alert("error" + error)
        }

    }
    useEffect(() => {
        FetchData();
    }, [data, DeleteData])
    if (loading) {
        return <div className="loaderdiv"><span className="loader"></span></div>
    }
    return (
        <>

            {
                action ? <UpdateDate />
                    :
                    <>
                        <div className="form-group3">

                            <Link to={"/"} className="buttonlink">Back</Link>
                        </div>

                        <div className="fixcard">
                            {
                                data.map((data, i) => {
                                    return (
                                        <>
                                            <div className="card" key={i}>
                                                <img src={Delete} onClick={() => DeleteData(data._id, data.image.cloudId)} alt="delete" className="deletebuT" />
                                                <img src={data.image.url} alt="Image" className="card-image" />
                                                <h2>{data.name}</h2>

                                                <Link to={`/views/${data._id}`}><img src={Update} alt="update" className="updatebuT" /></Link>

                                            </div>

                                        </>
                                    )
                                })
                            }
                        </div>
                    </>
            }


        </>
    )
}
export default Views;