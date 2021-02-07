import React, { Suspense } from "react";
// import { useImage } from "react-image";

function MyImageComponent(props) {
  // this.state = {
  //   heroImageUrl = null
  // }
  // console.log(props.heroImageUrl);
  // const { src } = useImage({
  //   srcList:
  //     "https://d1ralsognjng37.cloudfront.net/ed18cacc-3a5a-49ba-9b23-65c738e6feb5.jpeg",
  // });

  return (
    <div className="header-img" style={{ height: "300px", overflow: "hidden" }}>
      <img
        src={props.heroImageUrl}
        style={{ width: "100%", margin: "-5% 0 0 0" }}
      />
    </div>
  );
}

export default function MyComponent(props) {
  console.log(props.heroImageUrl);
  return (
    <Suspense fallback={<div>Loading... </div>}>
      <MyImageComponent heroImageUrl={props.heroImageUrl} />
    </Suspense>
  );
}
