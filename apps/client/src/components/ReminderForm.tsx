import { h } from 'preact';
import { useState } from 'preact/hooks';
import TagShortcuts from './TagShortcuts';

const url = "https://xcr2agxdue.execute-api.eu-north-1.amazonaws.com/prod";

const ReminderForm = () => {
    const [message, setMessage] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleTagClick = (discordId: string) => {
        setMessage((prev) => `${prev}<@${discordId}>`);
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsSubmitting(true);

        const isoString = new Date(time).toISOString();
        const body = { time: isoString, content: message };

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setMessage('');
            setTime('');
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        margin: '0 auto',
    };

    const labelStyle = {
        marginTop: '1rem',
    };

    const inputStyle = {
        marginTop: '0.5rem',
        padding: '0.5rem',
        fontSize: '1rem',
        resize: 'vertical',
    };

    const buttonStyle = {
        margin: '0',
        width: '100%',
        padding: '0.5rem',
        fontSize: '1rem',
        backgroundColor: isSubmitting ? '#ccc' : '#007bff',
        color: 'white',
        border: 'none',
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>
                Remind someone about anything you want
            </h1>
            <form onSubmit={handleSubmit} style={formStyle}>
                <label htmlFor="time" style={labelStyle}>
                    Time
                </label>
                <input
                    id="time"
                    name="time"
                    type="datetime-local"
                    required
                    value={time}
                    onInput={(e) => setTime((e.target as HTMLInputElement).value)}
                    style={inputStyle}
                />
                <br />
                <label htmlFor="message" style={labelStyle}>
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={1000}
                    value={message}
                    onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
                    style={{ ...inputStyle, minHeight: '100px' }}
                ></textarea>
                <button type="submit" disabled={isSubmitting} style={buttonStyle}>
                    {isSubmitting ? 'Sending...' : 'Remind'}
                </button>
            </form>
            <TagShortcuts message={message} onTagClick={handleTagClick} />
        </div>
    );
};

export default ReminderForm;
