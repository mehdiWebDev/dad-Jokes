import React, { Component } from 'react';
import axios from 'axios'
import './../jokeList.css';
import Joke from './Joke';
import { v4 as uuidv4 } from 'uuid';
import './../Joke.css'


class JokeList extends Component {

    static defaultProps ={
        numJokesToGet:10
    }
  
    constructor(props){
        super(props);
        this.state={jokes: JSON.parse(localStorage.getItem("jokes")|| "[]"),loading:false };
    
      
        this.getJokes=this.getJokes.bind(this)


    }


  componentDidMount(){

    
      if(this.state.jokes.length === 0){
      
         this.getJokes()
 
      }

   
      
    }

seenJoke(){
   let seenjokes = new Set(this.state.jokes.map(j=>j.joke))

    return seenjokes;
}

    async getJokes(){
        let jokes=[];

this.setState({loading:true})

    let seenJoke = this.seenJoke();


        while(jokes.length < this.props.numJokesToGet){

            let res = await axios.get("https://icanhazdadjoke.com/",{
                headers:{Accept:"application/json"}
            });
           
            
             let newJoke = res.data.joke;
             
        
             if(!seenJoke.has(newJoke)){
                jokes.push({joke:newJoke,votes:0,id:uuidv4()})
               
             }else{
                 console.log("found duplicate")
                 console.log(newJoke)
                
             }

         }



       
        let allJokes= [...this.state.jokes,...jokes]
         this.setState(st=>({
            loading:false
            ,jokes:[...st.jokes,...jokes]}))
    
         window.localStorage.setItem("jokes",JSON.stringify(allJokes))
    }





    handleVote(id,delta){

      this.setState(st =>({

        jokes:st.jokes.map( j => 
            j.id === id ? {...j,votes:j.votes + delta }: j)
         
      }),()=>{ 
          localStorage.setItem("jokes",JSON.stringify(this.state.jokes))
      }
      
      
      )
    }


    render() {

        if(this.state.loading){
            
             return(
              <div className='jokes-spiner'>
                 <i className='far fa-8x fa-laugh fa-spin' />
                 <h1 className='jokeList-title'>Loading... </h1>    
               </div>
             ) ;
            }


            let jokes = this.state.jokes.sort((a,b)=> b.votes-a.votes);
        return (
            
            <div className='jokeList'>
                <div className="jokeList-sidebar">

                    <h1 className='jokeList-title'> <span>Dad</span> jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="joke icone"/>
                    <button onClick={this.getJokes} className='jokeList-getmore'> New Jokes </button>

                </div>

                <div className="jokeList-joke">
                    {jokes.map(j =>{
                     return   <div>   {<Joke key={j.id} text={j.joke}  votes={j.votes} upvote={()=>this.handleVote(j.id,1)} 
                     downvote = { ()=> {this.handleVote(j.id,-1)}} />}  </div>
                    })}
                </div>
            </div>
        );
    }
}

export default JokeList;
