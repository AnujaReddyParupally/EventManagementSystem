import React from "react";
import {BsSearch} from "react-icons/bs";

const Search = (props) =>{
    return (<div style={{display:"flex"}}>
                <input type="text" 
                        placeholder="Search event by name" 
                        name="search" 
                        required 
                        onChange={props.onSearch}/>
                <span className="btn-search"><BsSearch/></span>
                {/* <button className="btn-search" >Search</button> */}
            </div>)
}


export default Search