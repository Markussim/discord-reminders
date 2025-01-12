import { h } from 'preact';

const testUsers = [
    { name: 'Ant', discordId: '231711102931697665' },
    { name: 'Mack', discordId: '292403753360031745' },
    { name: 'Liss', discordId: '400691601011113986' },
    { name: 'Svant', discordId: '225636267633803274' },
    { name: '@ genuine cheese people', discordId: '&690485351302692884' },
].sort((a, b) => a.name.localeCompare(b.name)); // Sort users by name

interface TagShortcutsProps {
    message: string;
    onTagClick: (discordId: string) => void;
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '2rem auto 0',
        width: '50%',
    },
    button: {
        margin: '0 0.5rem',
        padding: '0.5rem',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
};

const TagShortcuts = ({ message, onTagClick }: TagShortcutsProps) => (
    <div style={styles.container}>
        {testUsers.map(({ name, discordId }) => {
            const isDisabled = message.includes(discordId);
            const buttonStyle = isDisabled
                ? { ...styles.button, ...styles.buttonDisabled }
                : styles.button;

            return (
                <button
                    key={discordId}
                    disabled={isDisabled}
                    onClick={() => onTagClick(discordId)}
                    style={buttonStyle}
                >
                    {name}
                </button>
            );
        })}
    </div>
);

export default TagShortcuts;
