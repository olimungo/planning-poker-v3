import './board.css';
import { useParams, useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/database';
import { AppHeader, OverviewStory, OverviewTime, QrCode, WorkflowState, EWorkflowState, ErrorMessage, AppFooter, PigsList } from '../../components';
import { useEffect, useState } from 'react';
import { createBoardKey, getPigRef, getPigsRef } from './board.service';
import { checkBoardExists } from '..';
import { getScrumMasterRef } from '../common.services';

export function BoardPage() {
    const { key } = useParams<{ key: string }>();
    const history = useHistory();
    const [workflowState, setWorkflowState] = useState(EWorkflowState.REGISTRATION);
    const [errorMessage, setErrorMessage] = useState('');
    const [pigsRef, setPigsRef] = useState<firebase.database.Reference[]>([]);
    const scrumMasterRef = getScrumMasterRef(key)

    // Initialise board
    useEffect(() => {
        if (!key) {
            const boardKey = createBoardKey();

            if (boardKey) {
                history.push(`/board/${boardKey}`);
            } else {
                setErrorMessage('A mystic error occured while creating a board')
            }
        } else {
            checkBoardExists(key).then(boardExists => {
                if (!boardExists) {
                    setErrorMessage('The board referenced in the URL doesn\'t exist.')
                }
            });
        }
    }, [key, history]);

    // While waiting for pigs to register
    useEffect(() => {
        if (key) {
            getPigsRef(key).on('child_added', (value) => {
                if (value && value.key) {
                    const pig = getPigRef(key, value.key);

                    if (pig) {
                        setPigsRef((prevState) => [...prevState, pig]);
                    }
                }
            });
        }
    }, [key]);

    return (
        <div className="board">
            <AppHeader hideBadge={true} />
            <OverviewStory story={1} round={1} />
            <OverviewTime start="11:13" end="14:26" duration="1:34" story="3" pause="0:36" />
            <WorkflowState value={workflowState} />

            <div className="board--qrcode">
                <QrCode value={`${window.location.origin}/pig/${key}`} />
            </div>

            <PigsList pigsRef={pigsRef} scrumMasterRef={scrumMasterRef} onClick={() => { }} />

            <AppFooter hideToggle={true} />

            {
                errorMessage
                    ? <ErrorMessage message={errorMessage} />
                    : ''
            }

            <div className="board--spacer"></div>
        </div>
    );
}