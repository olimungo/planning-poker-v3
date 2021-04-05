import './app-footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Switch } from '../switch';

type Props = { hideToggle?: boolean, toggleChecked?: boolean, onSettings: Function, onToggleScrumMaster?: Function };

export function AppFooter(props: Props) {
  const { hideToggle = false, toggleChecked = false, onSettings, onToggleScrumMaster } = props;

  const handleToggle = (value: boolean) => {
    if (onToggleScrumMaster) {
      onToggleScrumMaster(value);
    }
  };

  return (
    <div className="app-footer">
      <div className="app-footer--container">
        <div className="app-footer--child">
          <FontAwesomeIcon className="app-footer--icon" icon={faGithub} onClick={() => window.open('https://github.com/olimungo/planning-poker', '_blank')} />
        </div>

        <div className="app-footer--child app-footer--centered" onClick={() => onSettings()}>
          <FontAwesomeIcon className="app-footer--icon" icon={faEllipsisH} />
        </div>

        <div className="app-footer--child app-footer--align-right">
          {
            !hideToggle
              ?
              <div className="app-footer--switch">
                <Switch value={toggleChecked} onToggle={handleToggle} />
              </div>
              : ''
          }
        </div>
      </div>
    </div>
  );
}