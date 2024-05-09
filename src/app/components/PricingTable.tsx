import React, { useEffect } from "react";

const StripePricingTable = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/pricing-table.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return React.createElement("stripe-pricing-table", {
        "pricing-table-id": "prctbl_1P9HvrJQssOJd1hyU6SnuCqF",
        "publishable-key": "pk_live_51NS1uBJQssOJd1hyBzMiuzgCX0No9w9f7XZLnl2oK6fmRVgqgpP5gvSH75fpPWiofkBT9WExeBD4sQZKTsopPvYz0066DcMuG9",
    });
};

export default StripePricingTable;
