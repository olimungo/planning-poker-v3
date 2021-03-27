import './overview.handler.css';
import { useEffect, useState } from 'react';
import { OverviewStory, OverviewTime } from '../../../../components';
import { getWorkflowRef } from '../../../services'

type Props = {
    boardKey: string
};

export function OverviewHandler(props: Props) {
    const { boardKey } = props;
    const [story, setStory] = useState<number | null>(null);
    const [stories, setStories] = useState<number | null>(null);
    const [round, setRound] = useState<number | null>(null);

    //Watch the workflow and update the display
    useEffect(() => {
        const workflowRef = getWorkflowRef(boardKey);

        workflowRef.child('step/story').on('value', (value) => setStory(value.val()));
        workflowRef.child('step/round').on('value', (value) => setRound(value.val()));

        return () => {
            workflowRef.child('step/story').off();
            workflowRef.child('step/round').off();
        };
    }, [boardKey]);

    return (
        <div className="overview-hanlder">
            <OverviewStory story={story} round={round} stories={stories} />
            <OverviewTime start="11:13" end="14:26" duration="1:34" pause="0:36" />
        </div>
    );
};