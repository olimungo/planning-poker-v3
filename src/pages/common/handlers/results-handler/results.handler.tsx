import './results.handler.css';
import { useContext, useEffect, useState } from "react";
import { Result } from "../../../../components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../../common';
import { Theme } from '../../app-context';

type Story = { key: number, estimate: string, duration: string };

export function ResultsHandler() {
    const appContext = useContext(AppContext);
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        if (appContext.workflow?.stories) {
            const storiesTemp: Story[] = [];

            for (let keyString in appContext.workflow.stories) {
                const key = parseInt(keyString);
                const dateStarted = appContext.workflow.stories[key].dateStarted;
                const dateEnded = appContext.workflow.stories[key].dateEnded || 0;
                const estimate = appContext.workflow.stories[key].finalEstimate || '';
                const duration = formatDuration(dateEnded - dateStarted);
                const newStory: Story = { key, estimate, duration }

                storiesTemp.push(newStory);
            }

            setStories(storiesTemp);
        }
    }, [appContext.workflow?.stories]);

    const formatDuration = (duration: number): string => {
        const inSeconds = Math.floor(duration / 1000);
        let minutes = Math.floor(inSeconds / 60);
        const hours = Math.floor((minutes / 60));
        const seconds = inSeconds % 60;

        if (seconds > 0) {
            minutes += 1;
        }

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
                ${appContext.theme === Theme.PRIMARY
                    ? 'results--button-primary'
                    : 'results--button-secondary'}`}
                onClick={handleClick}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </div>
    );
};