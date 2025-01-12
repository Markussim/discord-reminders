import { render } from 'preact';
import './style.css';
import ReminderForm from "./components/ReminderForm";

export function App() {
	return <ReminderForm />;
}

render(<App />, document.getElementById('app'));
