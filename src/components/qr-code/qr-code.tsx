import './qr-code.css';
import { QRCode } from "react-qr-svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

type Props = { value: string };

export function QrCode(props: Props) {
    const { value } = props;

    const sendMail = () => {
        const subject = 'Your Planning Poker session is ready';
        const message = value;
        window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message));
    }

    return (
        <div className="qr-code">
            <QRCode
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{ width: 256 }}
                value={value}
            />

            <button className="qr-code--button" onClick={sendMail}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </div>
    );
}