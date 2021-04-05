import './qr-code.css';
import { QRCode } from "react-qr-svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

type Props = { value: string };

export function QrCode(props: Props) {
    const { value } = props;
    const [qrCodeWidth, setQrCodeWidth] = useState(0);

    const sendMail = () => {
        const subject = 'Your Planning Poker session is ready';
        const message = value;
        window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message));
    }

    const setWidth = () => {
        const width = window.innerWidth;

        if (width < 550) {
            setQrCodeWidth(256 / 550 * width);
        } else {
            setQrCodeWidth(256);
        }
    };

    useEffect(() => {
        setWidth();

        window.onresize = (event: UIEvent) => {
            setWidth();
        };
    }, [qrCodeWidth]);

    return (
        <div className="qr-code">
            {
                qrCodeWidth
                    ? <QRCode
                        className="qr-code--border"
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        level="Q"
                        style={{ width: `${qrCodeWidth}` }}
                        value={value}
                    />
                    : ''

            }

            <button className="qr-code--button" onClick={sendMail}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </div>
    );
}