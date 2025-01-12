import { h } from 'preact';


const testUsers = [
    { name: 'Ant', discordId: '231711102931697665' },
    { name: 'Mack', discordId: '292403753360031745' },
    { name: 'Liss', discordId: '400691601011113986' },
    { name: 'Svant', discordId: '225636267633803274' },
    { name: '@ genuine cheese people', discordId: '&690485351302692884' },
];

// Sort users by name
testUsers.sort((a, b) => a.name.localeCompare(b.name));

interface TagShortcutsProps {
    message: string;
    onTagClick: (discordId: string) => void;
}

const TagShortcuts = ({ message, onTagClick }: TagShortcutsProps) => {
    const tagShortcutsStyle = {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '0 auto',
        marginTop: '2rem',
        width: '50%',
    };

    const buttonStyle = {
        margin: '0 0.5rem',
        padding: '0.5rem',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    };

    const buttonDisabledStyle = {
        ...buttonStyle,
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    };


    return (
        <div style={tagShortcutsStyle}>
            {testUsers.map((user) => {
                const isDisabled = message.includes(user.discordId);

                return (
                    <button
                        key={user.discordId}
                        disabled={isDisabled}
                        onClick={() => onTagClick(user.discordId)}
                        style={isDisabled ? buttonDisabledStyle : buttonStyle}
                    >
                        {user.name}
                    </button>
                )
            })}
        </div>
    );
};

export default TagShortcuts;
