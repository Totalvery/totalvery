import React, { useState, Suspense } from "react";
import { Element, Link } from "react-scroll";

// function CategoryElement({ items, fallback }) {
//   if (!items || items.length === 0) {
//     return fallback;
//   } else {
//     // return items.map((item) => {
//     return (
//       <div>
//         <Element name={items.title} className="category-title">
//           {items.title} <br></br>
//         </Element>
//       </div>
//     );
//     // });
//   }
// }

// function MenuElement({ items, sectionEntitiesMap, fallback }) {
//   if (!items || items.length === 0) {
//     return fallback;
//   } else {
//     return items.map((item) => {
//       var display = "inline-block";
//       try {
//         if (!sectionEntitiesMap[item].imageUrl) {
//           display = "none";
//           console.log(display);
//         }
//       } catch (error) {}

//       return (
//         <Element id={item} className="menu-item">
//           <div className="menu-description">
//             <b>
//               {item.title} {sectionEntitiesMap[item].title}
//             </b>
//             <br></br>
//             {sectionEntitiesMap[item].description}
//             <br></br>
//             <b>${parseFloat(sectionEntitiesMap[item].price) / 100}</b>
//           </div>
//           <div className="menu-img-wrapper">
//             <img
//               id="menu-img"
//               src={sectionEntitiesMap[item].imageUrl}
//               style={{ width: "150px", height: "130px", display: `${display}` }}
//             />
//           </div>
//         </Element>
//       );
//     });
//   }
// }
function FeeItem({ fee, fallback }) {
  console.log("each fee" + fee);
  if (!fee || fee.length === 0) {
    return fallback;
  } else {
    return Array.from(fee).map((each) => {
      console.log("each: " + each.deliveryFee);
      {
        return (
          <div>
            <Element id={each} className="fee-item">
              {each.deliveryFee} YAY
            </Element>
            Whaaat
          </div>
        );
      }
    });
  }
}

class FeeInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: [],
      fee: [],
    };
  }
  componentDidMount() {
    if (this.props.isOpen) {
      this.setState({ isOpen: this.props.isOpen });
    }
    if (this.props.fee) {
      this.setState({ fee: this.props.fee });
      console.log("FEEE: " + this.state.fee);
    }
  }

  render() {
    return (
      <div className="fee-block">
        <FeeItem fee={this.state.fee} fallback={"Loading..."} />
        what
      </div>
    );
  }
}

export default FeeInfo;
