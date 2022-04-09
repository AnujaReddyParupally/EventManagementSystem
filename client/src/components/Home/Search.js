import React from "react";
import {BsSearch} from "react-icons/bs";

const Search = (props) =>{
    return (<div style={{display:"flex"}}>
                <input type="text" 
                        placeholder="Search event by name" 
                        name="search" 
                        required 
                        value={props.searchterm}
                        onChange={props.onSearch}/>
                <span className="btn-search"><BsSearch/></span>
            </div>)
}


export default Search