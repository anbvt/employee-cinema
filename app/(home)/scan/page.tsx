"use client"
import {DescriptionComponent, QrScanComponent} from "@components";
import { fetchAPI } from "@hook/fetchAPI";
import { useEffect, useState } from "react";

const ScanPage = () => {
    const [data, setData] = useState('No result');

    const fetchData = async() =>{
        const {data:result} = await fetchAPI.get("/bill/getByQR/"+data); 
    }

    return (
        <div className="w-50">
            <QrScanComponent data={data} setData={setData}/>
            <DescriptionComponent title="Thông tin vé" data={data}/>
        </div>
    )
}
export default ScanPage;