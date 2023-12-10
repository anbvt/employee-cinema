import React, { forwardRef } from "react";

const ComponentToPrint = forwardRef((props: any, ref: any,) => {
    return (
        <div ref={ref}>
            {props.children}
        </div>
    );
});
export default ComponentToPrint;