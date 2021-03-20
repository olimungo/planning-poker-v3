import './board.css';
import { useParams, useHistory } from 'react-router-dom';
import { AppHeader, OverviewStory, OverviewTime, QrCode, WorkflowState, EWorkflowState } from '../../components';
import { useEffect, useState } from 'react';
import { getBoardKey, waitForPig$, setBoardDateCreated, getBoardDateCreated } from './board.service';

export function Board() {
    const { key } = useParams<{ key: string }>();
    const history = useHistory();
    const [workflowState, setWorkflowState] = useState(EWorkflowState.REGISTRATION);

    useEffect(() => {
        if (!key) {
            const boardKey = getBoardKey();

            if (boardKey) {
                history.push(`/board/${boardKey}`);
            }
        } else {
            getBoardDateCreated(key).then(dateCreated => {
                if (!dateCreated) {
                    const waitForPig = waitForPig$(key)
                        .subscribe(() => {
                            setBoardDateCreated(key);
                            waitForPig.unsubscribe();
                        });
                }
            });
        }
    }, [key, history]);

    return (
        <div className="board">
            <AppHeader hideBadge={true} />
            <OverviewStory story={1} round={1} />
            <OverviewTime start="11:13" end="14:26" duration="1:34" story="3" pause="0:36" />
            <WorkflowState value={workflowState} />

            <div className="board--qrcode">
                <QrCode value={`${window.location.origin}/pig/${key}`} />
            </div>
        </div>
    );
}