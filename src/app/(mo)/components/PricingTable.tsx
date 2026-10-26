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
        "pricing-table-id": "prctbl_1NRXkAD06hPxM9TK5LXPUTTg",
        "publishable-key": "pk_live_51MhzlfD06hPxM9TKX3bZ25Op6Wv6xxKQFROtQx3BiJei2e1Ijw2g2nXWBppVkikTf72gjZXJe5qL9LlElTreOHnS003DwnnGIL",
    });
};

export default StripePricingTable;
