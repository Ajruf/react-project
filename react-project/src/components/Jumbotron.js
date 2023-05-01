import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useContext } from "react"
import { ImageContext } from "../App"
import Image from "./Image";

const Jumbotron = () => {
    const { response, isLoading } = useContext(ImageContext);
    return(
       <>
        <div class="card mb-3" align="center">
            <div class="card-body">
                <h1>
                    Image Search
                </h1>  
            
                <div>
                    <input type="search" placeholder="Search Anything"/>
                    <button>Search</button>
                </div>
                <div>
                    <h2>Results for:</h2>
                </div>
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                        {response.map((data, key) => <Image key={key} data={data} />)}
                    </div>
                </div>
            </div>
        </div>
       </>    
       
    )
}

const Images = () => {
    return (
        <div>Images</div>
    )
}

export default Jumbotron;
