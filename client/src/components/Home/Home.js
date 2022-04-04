import axios from 'axios'
import React, { Component } from 'react'
import Events from '../Events/Events'
import Spinner from '../Spinner/Spinner'
import Search from './Search'

const DUMMY_EVENTS=[
    {   
        _id:1, 
        eventname: 'sunt aut facere',
        city:'Hyderabad',
        ImageURL:'event1.jpeg', 
        tags:['sunt','facere','optio'],
        description: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto. '
    },
    {   
        _id:2, 
        eventname: 'qui est esse',
        city:'Bangalore',
        ImageURL:'event2.jpg', 
        tags:['est','qui','esse'],
        description: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla.'
    },
    {   
        _id:3, 
        eventname: 'ea qui ipsa sit aut',
        city:'Delhi',
        ImageURL:'event3.jpg', 
        tags:['ea','qui','ipsa'],
        description: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut.'
    },
    {   
        _id:4, 
        eventname: 'eum et est occaecati',
        city:'Mumbai',
        ImageURL:'event4.jpeg', 
        tags:['et','est','eum'],
        description: 'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit.'
    },
    {   
        _id:5, 
        eventname: 'nesciunt quas odio',
        city:'Mumbai',
        ImageURL:'event5.jpg', 
        tags:['quas','odio'],
        description: 'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque.'
    },
    {   
        _id:6, 
        eventname: 'magnam facilis autem',
        city:'Hyderabad',
        ImageURL:'event6.jpg', 
        tags:['magnam'],
        description: 'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque.'
    },
    {   
        _id:7, 
        eventname: 'magnam facilis autem2',
        city:'Delhi',
        ImageURL:'event6.jpg', 
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
const ERRORS = {
    GENERIC_FAILED: "Oops! Something went wrong. Please try again."
}
class Home extends Component{
    constructor(){
        super()
        this.state={
            selectedCity:'',
            events:[],
            searchterm:'',
            cities: [],
            isLoading: true
        }
        this.typingTimer = null;
        this.onSearchChange= this.onSearchChange.bind(this)
        this.onCityFilterChange = this.onCityFilterChange.bind(this);
    }

    componentDidMount(){
        let cities= CITIES.sort((a,b)=>a.name > b.name ? 1 : -1)
        let errorMessages = []
        //get api data and assign it to events in state
        axios.get('/api/v1/events').then(res=>{
            this.setState({...this.state, events: res.data, cities, isLoading: false})
        })
        .catch(err=>{
            errorMessages.push(ERRORS.GENERIC_FAILED)
            this.setState({...this.state, errorMessages, cities, isLoading: false})
        })
    }
    
    onSearchChange(event){
        var searchTxt = event.target.value;
        let errorMessages = []

        this.setState({...this.state, isLoading: true})
        //SEARCH WITH ATLEAST 3 CHARACTERS
        if(searchTxt.trim().length > 2){
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(() => {
                axios.get(`api/v1/events/searchevent/${searchTxt}`).then(res=>{
                    if(res.status===200){
                        this.setState({...this.state, searchterm: searchTxt, events : res.data, isLoading: false});
                        console.log(res.data);
                    }
                })
                .catch((err)=>{
                    this.setState({...this.state, searchterm: searchTxt, isLoading: false})
                })
            }, 2000);   
        }   
        else{
            clearTimeout(this.typingTimer);
            axios.get('/api/v1/events').then(res=>{
                this.setState({...this.state, events: res.data, isLoading: false})
            })
            .catch(err=>{
                errorMessages.push(ERRORS.GENERIC_FAILED)
                this.setState({...this.state, errorMessages, isLoading: false})
            })
        }

    }

    onCityFilterChange(event) {
        var searchTxt = event.target.value;
        let errorMessages= []
        this.setState({...this.state, isLoading: true})
        if (searchTxt != null && searchTxt) {
          console.log(searchTxt);
          axios
            .get(`/api/v1/events/searchbycity/${searchTxt}`)
            .then((res) => {
              if (res.status === 200) {
                this.setState({
                  ...this.state,
                  searchterm: searchTxt,
                  events: res.data,
                });
                console.log(res.data);
              }
            })
            .catch((err) => {
                errorMessages.push(ERRORS.GENERIC_FAILED)
              this.setState({ ...this.state, errorMessages, searchterm: searchTxt});
            });
        }
        else{
            axios.get('/api/v1/events').then(res=>{
                this.setState({...this.state, events: res.data, isLoading: false})
            })
            .catch(err=>{
                errorMessages.push(ERRORS.GENERIC_FAILED)
                this.setState({...this.state, errorMessages, isLoading: false})
            })
        }
      }

    render(){
        return (
        <div className='home' >
            <Spinner isLoading={this.state.isLoading}/>
            <div className='filters'>
                <div style={{display:"flex"}}   >
                <p>Filter by City</p>
                <select className='filters-select' onChange={this.onCityFilterChange}>
                    <option value="">Select city</option>
                    {this.state.cities.map((city)=>{
                        return  <option key={city.id} value={city.name}>{city.name}</option>
                    })}
                </select>
                </div>  
                 <Search onSearch={this.onSearchChange}/>
            </div>
            {/* <h3 style={{marginLeft: "20px"}}>All events</h3> */}
            {this.typingTimer
            ?<h3 style={{marginLeft: "20px"}}>Events Found</h3>
            :<h3 style={{marginLeft: "20px"}}>All Events</h3>
            }
            <Events events={this.state.events}/> 
        </div>)
    }
}

export default Home