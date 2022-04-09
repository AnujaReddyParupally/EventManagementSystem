import React from "react";

const Search = (props) =>{
    return (<div style={{display:"flex"}}>
                <input type="text" 
                        placeholder="Search event by name" 
                        name="search" 
                        required 
                        onChange={props.onSearch}/>
                <button className="btn-search">Search</button>
            </div>)
}


export default Search