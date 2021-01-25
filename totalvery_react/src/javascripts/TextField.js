import React from "react";
import { Redirect } from 'react-router';

class TextField extends React.Component {
    constructor(props){
        super(props)
        this.state={
            location:'',
            redirectToReferrer:false
        }
        this.handleFormSubmit=this.handleFormSubmit.bind(this)
        this.handleValueChange=this.handleValueChange.bind(this)
    }
    handleFormSubmit(e){
        e.preventDefault()
        this.setState({
            redirectToReferrer:true})
    }
    handleValueChange(e){
        let nextState={};
        nextState[e.target.name]=e.target.value;
        this.setState(nextState)
    }
    render(){
        const redirectToReferrer = this.state.redirectToReferrer;
        if (redirectToReferrer) {
            return <Redirect to={{ pathname: '/search', state: { location: this.state.location} }} />
        }
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