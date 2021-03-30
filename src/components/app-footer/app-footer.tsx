import './app-footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { Switch } from '../switch';

type Props = { hideToggle?: boolean, toggleChecked?: boolean, onToggleScrumMaster?: Function };

export function AppFooter(props: Props) {
  const { hideToggle = false, toggleChecked = false, onToggleScrumMaster } = props;

  const handleToggle = (value: boolean) => {
    if (onToggleScrumMaster) {
      onToggleScrumMaster(value);
    }
  };

  return (
    <div className="app-footer">
      <div className="app-footer--container">
        <FontAwesomeIcon className="app-footer--icon" icon={faGithub} onClick={() => window.open('https://github.com/olimungo/planning-poker', '_blank')} />

        {
          !hideToggle
            ?
            <div className="app-footer--switch">
              <div className="app-footer--switch-label">SCRUM MASTER</div>
              <Switch value={toggleChecked} onToggle={handleToggle} />
            </div>
            : ''
        }
      </div>
    </div>
  );
}