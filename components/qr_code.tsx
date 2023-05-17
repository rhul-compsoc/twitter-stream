import React from 'react';

const QrCode: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
    return (
        <div className={`qrCode ${props.className ?? ""}`}><img src="/wall/qr_code.png" alt="QR Code" /></div>
    )
};

export default QrCode;