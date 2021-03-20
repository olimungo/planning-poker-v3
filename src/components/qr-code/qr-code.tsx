import { QRCode } from "react-qr-svg";

type Props = { value: string };

export function QrCode(props: Props) {
    const { value } = props;

    return (
        <QRCode
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
            style={{ width: 256 }}
            value={value}
        />
    );
}