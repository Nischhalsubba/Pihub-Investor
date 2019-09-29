import React from "react";

export const ToEuro = ({amount}) => {
    return (
        <div>
            € {amount ? Number(amount).toLocaleString("de-DE", {minimumFractionDigits: 2}): ''}
        </div>
    );
};
