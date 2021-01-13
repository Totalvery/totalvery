import React from "react";

class TextField extends React.Component {
    constructor(props){
        super(props)
        this.state={
            location:''
        }
        this.handleFormSubmit=this.handleFormSubmit.bind(this)
        this.handleValueChange=this.handleValueChange.bind(this)
        this.sendLocation=this.sendLocation.bind(this)
    }
    sendLocation(url,data) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response;
              } else {
               console.log('Somthing happened wrong');
              }
        }).catch(err => err);
    }
    handleFormSubmit(e){
        e.preventDefault()
        const url='/api/getFeed'
        const data={
            'location':this.state.location
        }
        this.sendLocation(url,data)
    }
    handleValueChange(e){
        let nextState={};
        nextState[e.target.name]=e.target.value;
        this.setState(nextState)
    }
    render(){
    return(
        <div className="textfield">
            <form onSubmit={this.handleFormSubmit}>
            <label>
                <input onChange={this.handleValueChange} value={this.state.location} type="text" name="location" style={{width: "420px", height: "40px", fontSize:"20px"}}/>
            </label>
            {/* hyperlink the button to address search page */}
            <button className="button" type="submit" variant='primary' style={{width:"130px", height:"40px", fontSize:"20px"}}
                >Find</button>
            </form>
        </div>
    )
   }
}

export default TextField;