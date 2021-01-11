import React from "react";

function TextField() {
    return(
        <div className="textfield">
            <label>
                <input type="text" name="name" />
            </label>
            <button className="button" type="submit" variant='primary' size='lg'>Find</button>
            
        </div>
    )
}

export default TextField;