import React from "react";

function TextField() {
    return(
        <div className="textfield">
            <form >
            <label>
                <input type="text" name="name" style={{width: "420px", height: "40px", fontSize:"20px"}}/>
            </label>
            {/* hyperlink the button to address search page */}
            <button className="button" type="submit" variant='primary' style={{width:"130px", height:"40px", fontSize:"20px"}}
                >Find</button>
            </form>
        </div>
    )
}

export default TextField;