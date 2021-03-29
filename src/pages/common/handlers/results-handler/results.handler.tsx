import './results.handler.css';
import { useEffect, useState } from "react";
import { Result } from "../../../../components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { getStoriesRef } from "../../../services";

export enum EResultTheme {
    'PRIMARY',
    'SECONDARY'
}

type Props = { boardKey: string, theme: EResultTheme };
type Story = { key: number, estimate: string, duration: string };

export function ResultsHandler(props: Props) {
    const { boardKey, theme } = props;
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        getStoriesRef(boardKey).once('value', (value) => {
            value.forEach(story => {
                const key = parseInt(story.key || '');
                const estimate = story.child('finalEstimate').val()
                const dateStarted = parseInt(story.child('dateStarted').val());
                const dateEnded = parseInt(story.child('dateEnded').val());
                const duration = formatDuration(dateEnded - dateStarted);
                const newStory: Story = { key, estimate, duration }

                setStories((prevStories) => [...prevStories, newStory]);
            });
        });
    }, [boardKey]);

    const formatDuration = (duration: number): string => {
        const inMinutes = Math.floor(duration / 1000 / 60);
        const hours = Math.floor((inMinutes / 60));
        const minutes = inMinutes % 60;

        return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
    }

    const handleClick = () => {
        const subject = 'Planning poker estimations';
        const message = stories.reduce((previous, story, index) => {
            return previous + `Story ${index + 1}: ${story.estimate} (${story.duration})\n`;
        }, '');

        window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message));
    };

    return (
        <div className="results">
            <div className="results--story">{'/* stories */'}</div>
            <div className="results--header">
                <div className="results--header-story">#</div>
                <div className="results--header-estimate">&gt; | &lt;</div>
                <div className="results--header-duration">&lt;==&gt;</div>
            </div>
            {
                stories.map(story => <Result key={story.key} story={story.key} estimate={story.estimate} duration={story.duration} />)
            }

            <button className={`results--button 
                ${theme === EResultTheme.PRIMARY
                    ? 'results--button-primary'
                    : 'results--button-secondary'}`}
                onClick={handleClick}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </div>
    );
};