import './overview.handler.css';
import firebase from 'firebase/app';
import 'firebase/database';
import { useEffect, useState } from 'react';
import { OverviewStory, OverviewTime } from '../../../../components';
import { getWorkflowRef } from '../../../services'

type Props = {
    boardKey: string
};

export function OverviewHandler(props: Props) {
    const { boardKey } = props;
    const [workflowRef, setWorkflowRef] = useState<firebase.database.Reference | null>(null);
    const [story, setStory] = useState<number | null>(null);
    const [round, setRound] = useState<number | null>(null);

    // Get a reference to the workflow
    useEffect(() => {
        if (boardKey) {
            setWorkflowRef(getWorkflowRef(boardKey));
        }
    }, [boardKey]);

    //Watch the workflow and update the display
    useEffect(() => {
        if (workflowRef) {
            workflowRef.child('step/story').on('value', (value) => setStory(value.val()));
            workflowRef.child('step/round').on('value', (value) => setRound(value.val()));
        }

        // The return statement is executed on ComponentWillUnmount React event
        return () => {
            // Stop watching the workflow when component is discarded
            if (workflowRef) {
                workflowRef.child('step/story').off();
                workflowRef.child('step/round').off();
            }
        };
    }, [workflowRef]);

    return (
        <div className="overview-hanlder">
            <OverviewStory story={story} round={round} />
            <OverviewTime start="11:13" end="14:26" duration="1:34" story="3" pause="0:36" />
        </div>
    );
};