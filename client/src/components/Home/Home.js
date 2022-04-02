import React, { Component } from 'react'
import Events from '../Events/Events'
import Search from './Search'
import axios from 'axios'

const DUMMY_EVENTS=[
    {   
        id:1, 
        title: 'sunt aut facere',
        city:'Hyderabad',
        image:'event1.jpeg', 
        tags:['sunt','facere','optio'],
        description: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto. '
    },
    {   
        id:2, 
        title: 'qui est esse',
        city:'Bangalore',
        image:'event2.jpg', 
        tags:['est','qui','esse'],
        description: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla.'
    },
    {   
        id:3, 
        title: 'ea qui ipsa sit aut',
        city:'Delhi',
        image:'event3.jpg', 
        tags:['ea','qui','ipsa'],
        description: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut.'
    },
    {   
        id:4, 
        title: 'eum et est occaecati',
        city:'Mumbai',
        image:'event4.jpeg', 
        tags:['et','est','eum'],
        description: 'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit.'
    },
    {   
        id:5, 
        title: 'nesciunt quas odio',
        city:'Mumbai',
        image:'event5.jpg', 
        tags:['quas','odio'],
        description: 'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque.'
    },
    {   
        id:6, 
        title: 'magnam facilis autem',
        city:'Hyderabad',
        image:'event6.jpg', 
        tags:['magnam'],
        description: 'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque.'
    },
    {   
        id:7, 
        title: 'magnam facilis autem2',
        city:'Delhi',
        image:'event6.jpg', 
        tags:['magnam'],
        description: 'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque.'
    },
]
const CITIES=[
    {id: 1, name: 'Hyderabad'},
    {id: 2, name: 'Bangalore'},
    {id: 3, name: 'Delhi'},
    {id: 4, name: 'Mumbai'}
]

class Home extends Component{
    constructor(){
        super()
        this.state={
            selectedCity:'',
            events:[],
            searchterm:'',
            cities: []
        }
        this.typingTimer = null;
        this.onSearchChange= this.onSearchChange.bind(this)
    }

    componentDidMount(){
        //get api data and assign it to events in state
        clearTimeout(this.typingTimer);
        let cities= CITIES.sort((a,b)=>a.name > b.name ? 1 : -1)
        this.setState({...this.state, events: DUMMY_EVENTS, cities})
        console.log('all events')
    }
    
    onSearchChange(event){
        var searchTxt = event.target.value;
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => {
            axios.get(`api/v1/admin/searchevent/${searchTxt}`).then(res=>{
                // console.log(res)
                if(res.status===200){
                    this.setState({...this.state, searchterm: searchTxt, events : res.data});
                    console.log(res.data);
                }
            })
            .catch((err)=>{
                this.setState({...this.state, searchterm: null})
            })
       }, 2000);        
       
        
    }
    render(){
        return (
        <div className='home' >
            <div className='filters'>
                <div style={{display:"flex"}}   >
                <p>Filter by City</p>
                <select className='filters-select'>
                    <option value="0">Select city</option>
                    {this.state.cities.map((city)=>{
                        return  <option key={city.id} value={city.id}>{city.name}</option>
                    })}
                </select>
                </div>  
                 <Search onSearch={this.onSearchChange}/>
            </div>
            {this.typingTimer
            ?<h3 style={{marginLeft: "20px"}}>Events Found</h3>
            :<h3 style={{marginLeft: "20px"}}>All Events</h3>
            }
            
            {this.state.events.length ? <Events events={this.state.events}/> : ''}
        </div>)
    }
}

export default Home