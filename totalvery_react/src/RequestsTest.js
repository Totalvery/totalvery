import React from 'react';

class RequestsTest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title:null,
            address:null,
            priceRange:null
        }
    }

    componentDidMount() {

        // this is an example for the request body
        const payload = { meta: { ubereats: "true", doordash: "true", grubhub: "true" },
        ids: 
         { ubereatsID: '65f472f1-5f54-4429-8956-0774ffee6cdd',
           doordashID: '540546',
           grubhubID: '332063' },
        customer_location: { latitude: '32.2250168', longitude: '-110.9539833' } };

        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };
        fetch('http://127.0.0.1:8000/api/getStoreDetails/', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ title: data.title, address: data.location.address, priceRange:data.priceRange}));
            
    }

    render() {
        return (
            <div className='store-detail'>
                <h1 className='store-title'>{this.state.title}</h1>
                <div className='priceRange'>{this.state.priceRange}</div>
                <div className='address'>{this.state.address}</div>
            </div>
        );
    }
}

export default RequestsTest ; 