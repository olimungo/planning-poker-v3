import './error-message.css';

type Props = { message: string };

export function ErrorMessage(props: Props) {
    const { message } = props;

    return (
        <div>
            {
                message
                    ? <div className="error-message">
                        <div className="error-message--title">Software failure: Guru medidation #00000000003.00C06560</div>
                        <div className="error-message--message">{message}</div>
                    </div>
                    : ''
            }
        </div>
    );
}