import React, {Component} from "react";

class TextField extends Component {
    state = {address: ''}

    constructor(props) {
        super(props);
        this.state = {address: ''};
    }

    handleChange = event => {
        this.setState({address: event.target.value});
    };

    handleKeyDown = event => {
        if (event.key === 'Enter') {
            this.setState({address: event.target.value});
            console.log('entered address: '+this.state.address);
        }
    }

    render() {
        return(
            <React.Fragment>
                <form>
                    <input
                        type="text"
                        name="address"
                        style={{width: "420px", height: "40px", fontSize:"20px"}}
                        placeholder="Enter your address"
                        value={this.state.address}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                    />
                    <button className="button" type="enter" variant='primary' style={{width:"130px", height:"40px", fontSize:"20px"}}>Find</button>
                </form>
                
                {/* <h3>address: {this.state.address}</h3> */}
            </React.Fragment>
        )
    }
}

export default TextField;